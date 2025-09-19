import os
import joblib
import numpy as np
import google.generativeai as genai
import requests
import time
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ------------------------------
# Load environment variables
# ------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path)

API_KEY = os.getenv("GOOGLE_API_KEY")
print("Loaded API_KEY:", API_KEY)
genai.configure(api_key=API_KEY)

# ------------------------------
# Load ML model, scaler, and label encoder
# ------------------------------
try:
    model = joblib.load(os.path.join(BASE_DIR, "crop_rf_model.pkl"))
    scaler = joblib.load(os.path.join(BASE_DIR, "crop_scaler.pkl"))
    le = joblib.load(os.path.join(BASE_DIR, "crop_label_encoder.pkl"))
    print("Models loaded successfully.")
except Exception as e:
    print("Error loading models:", e)
    model = scaler = le = None

# ------------------------------
# Gemini Model configs
# ------------------------------
generation_config = {
    "temperature": 0.5,
    "max_output_tokens": 512,
}

text_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# ------------------------------
# FastAPI app
# ------------------------------
app = FastAPI()

# Enable CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Input validation schema
# ------------------------------
class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

def generate_image(prompt: str):
    """
    Generates an image using the gemini-2.5-flash-image-preview API.
    """
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key={API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [{ "text": prompt }]
        }],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"]
        },
    }
    
    # Retry logic for 429 Too Many Requests error
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.post(
                api_url,
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            result = response.json()
            
            # The image data is nested differently for this model
            if result.get("candidates") and result["candidates"][0].get("content") and result["candidates"][0]["content"].get("parts"):
                for part in result["candidates"][0]["content"]["parts"]:
                    if part.get("inlineData") and part["inlineData"].get("data"):
                        return part["inlineData"]["data"]
            
            print("Error: Image generation failed or no data returned from API.")
            print("API response:", result)
            return None
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429 and attempt < max_retries - 1:
                wait_time = 2 ** (attempt + 1)
                print(f"Rate limit exceeded (429). Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
                continue
            else:
                print(f"Error calling image generation API: {e}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"Error calling image generation API: {e}")
            return None
        except Exception as e:
            print(f"An unexpected error occurred during image generation: {e}")
            return None

# ------------------------------
# API endpoint for crop prediction
# ------------------------------
@app.post("/predict")
def predict_crop(data: CropInput):
    if not model or not scaler or not le:
        return {"recommendations": [
            {"crop": "Error", "probability": 0.0, "description": "Model not loaded."}
        ]}

    try:
        sample = [
            float(data.N), float(data.P), float(data.K),
            float(data.temperature), float(data.humidity),
            float(data.ph), float(data.rainfall)
        ]

        if any(np.isnan(val) for val in sample):
            return {"recommendations": [
                {"crop": "Error", "probability": 0.0, "description": "Invalid input values."}
            ]}

        scaled = scaler.transform([sample])
        probs = model.predict_proba(scaled)[0]

        top_idx = np.argsort(probs)[-3:][::-1]
        crops = le.inverse_transform(top_idx)

        recommendations = []
        
        # Generate image for the top recommendation only
        top_crop_name = crops[0]
        image_prompt = f"A photo of a {top_crop_name} plant."
        image_data = generate_image(image_prompt)

        for j in range(len(top_idx)):
            crop_name = crops[j]
            probability = float(probs[top_idx[j]])
            
            text_prompt = (
                f"Write a farmer-friendly guide for {crop_name}.\n"
                f"Start with '**Health Benefits:**' followed by a list using hyphens (-).\n"
                f"Then add '**Farming Tips:**' also in a list using hyphens (-).\n"
                f"Keep it short, clear, and easy to read.\n"
                f"⚠️ Do NOT include probability, percentages, or confidence values."
            )

            try:
                text_response = text_model.generate_content([text_prompt])
                description = text_response.text
            except Exception as e:
                print(f"Gemini generation error for {crop_name}:", e)
                description = (
                    f"**Health Benefits:**\n"
                    f"- {crop_name.capitalize()} is nutritious and supports good health.\n\n"
                    f"**Farming Tips:**\n"
                    f"- Follow standard cultivation and care practices."
                )

            recommendation = {
                "crop": crop_name,
                "probability": probability,
                "description": description,
                "image_data": None
            }
            
            # Attach the generated image data to the top recommendation only
            if j == 0:
                recommendation["image_data"] = image_data
                
            recommendations.append(recommendation)

        return {"recommendations": recommendations}

    except Exception as e:
        print("Unexpected error:", e)
        return {"recommendations": [
            {"crop": "Error", "probability": 0.0, "description": "Unexpected error occurred."}
        ]}

# ------------------------------
# Run directly (optional)
# ------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
