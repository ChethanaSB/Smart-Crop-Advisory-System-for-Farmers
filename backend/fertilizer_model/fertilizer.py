# fertilizer.py
import os
import joblib
import pandas as pd
import google.generativeai as genai
import traceback
import json
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, root_validator, validator
from starlette.concurrency import run_in_threadpool

# --------------------------------------------------------------------------
# 1. INITIAL SETUP & CONFIGURATION
# --------------------------------------------------------------------------

try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(BASE_DIR, ".env")
    load_dotenv(dotenv_path)
    API_KEY = os.getenv("GOOGLE_API_KEY")
    if not API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in .env file.")
    genai.configure(api_key=API_KEY)
    print("✅ Google Generative AI configured successfully.")
except Exception as e:
    print(f"🚨 Configuration Error: {e}")
    exit()

generation_config = {
    "temperature": 0.5,
    "max_output_tokens": 512,
}
text_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# --------------------------------------------------------------------------
# 2. LOAD ML MODELS AT STARTUP
# --------------------------------------------------------------------------

PIPELINE = None
LABEL_ENCODER = None
try:
    pipeline_path = os.path.join(BASE_DIR, "fertilizer_pipeline.pkl")
    le_path = os.path.join(BASE_DIR, "label_encoder.pkl")
    PIPELINE = joblib.load(pipeline_path)
    LABEL_ENCODER = joblib.load(le_path)
    print("✅ ML models ('fertilizer_pipeline.pkl', 'label_encoder.pkl') loaded successfully!")
except Exception as e:
    print(f"❌ CRITICAL ERROR: Failed to load ML models. Error: {e}")
    exit()

# --------------------------------------------------------------------------
# 3. FASTAPI APPLICATION SETUP
# --------------------------------------------------------------------------

app = FastAPI(
    title="Fertilizer Recommendation API",
    description="An API to recommend fertilizer and provide AI-generated details via streaming."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FertilizerInput(BaseModel):
    n: int
    p: int
    k: int
    temperature: float
    humidity: float
    moisture: int
    soil_type: str
    crop_type: str
    
    @validator('soil_type', 'crop_type', pre=True)
    def to_lower(cls, value):
        if isinstance(value, str):
            return value.lower()
        return value

    @root_validator(pre=True)
    def standardize_case(cls, values):
        return {key.lower(): value for key, value in values.items()}


# --------------------------------------------------------------------------
# 4. API ENDPOINTS
# --------------------------------------------------------------------------

@app.get("/")
def read_root():
    return {"message": "Welcome to the Fertilizer Recommendation API."}

@app.post("/recommend-fertilizer")
async def recommend_fertilizer(data: FertilizerInput):
    if not PIPELINE or not LABEL_ENCODER:
        raise HTTPException(
            status_code=503,
            detail="Server not ready: ML models unavailable."
        )

    def run_prediction(input_data):
        input_df = pd.DataFrame([input_data])
        rename_map = {
            'n': 'N', 'p': 'P', 'k': 'K', 'temperature': 'Temperature',
            'humidity': 'Humidity', 'moisture': 'Moisture',
            'soil_type': 'Soil_Type', 'crop_type': 'Crop_Type'
        }
        input_df.rename(columns=rename_map, inplace=True)
        feature_order = [
            'N', 'P', 'K', 'Temperature', 'Humidity', 
            'Moisture', 'Soil_Type', 'Crop_Type'
        ]
        input_df = input_df[feature_order]
        prediction_encoded = PIPELINE.predict(input_df)
        return LABEL_ENCODER.inverse_transform(prediction_encoded)[0]

    async def response_generator():
        try:
            input_dict = data.dict()
            fertilizer_name = await run_in_threadpool(run_prediction, input_dict)

            initial_response = {"fertilizer_name": fertilizer_name, "description": "🧠 Generating expert advice..."}
            yield f"{json.dumps(initial_response)}\n"

            text_prompt = (
                f"You are an agricultural expert. Provide a simple, farmer-friendly guide for '{fertilizer_name}' fertilizer "
                f"for a farmer growing '{data.crop_type}' in '{data.soil_type}' soil.\n\n"
                f"1.  **What It Is:** Briefly explain what this fertilizer is.\n"
                f"2.  **Key Benefits:** Create a bulleted list of its main benefits for the specified crop.\n"
                f"3.  **How to Apply:** Give simple, step-by-step application instructions.\n"
                f"4.  **Important Note:** Add a brief, friendly precaution.\n\n"
                f"Keep the language very clear, direct, and encouraging."
            )
            
            text_response = await text_model.generate_content_async(text_prompt)
            description = text_response.text

            final_response = {"fertilizer_name": fertilizer_name, "description": description}
            yield f"{json.dumps(final_response)}\n"

        except Exception as e:
            error_response = {"error": f"An internal error occurred: {e}"}
            yield f"{json.dumps(error_response)}\n"
            traceback.print_exc()

    return StreamingResponse(response_generator(), media_type="application/x-ndjson")

# --------------------------------------------------------------------------
# 5. RUN THE APPLICATION
# --------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI server on port 8001...")
    # 🚨 CORRECTED: The port is now 8001
    uvicorn.run("fertilizer:app", host="127.0.0.1", port=8001, reload=True)