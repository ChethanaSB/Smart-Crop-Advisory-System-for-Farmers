import React, { useState } from "react";

export default function CropPredictionForm() {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: parseFloat(formData.nitrogen),
          P: parseFloat(formData.phosphorus),
          K: parseFloat(formData.potassium),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          ph: parseFloat(formData.ph),
          rainfall: parseFloat(formData.rainfall),
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      setOutput(result.recommendations);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setOutput([{ crop: "Error", description: "❌ Failed to get prediction." }]);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "nitrogen", label: "Nitrogen (N)" },
    { name: "phosphorus", label: "Phosphorus (P)" },
    { name: "potassium", label: "Potassium (K)" },
    { name: "temperature", label: "Temperature (°C)" },
    { name: "humidity", label: "Humidity (%)" },
    { name: "ph", label: "pH Value" },
    { name: "rainfall", label: "Rainfall (mm)" },
  ];

  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Check for bold headings
      if (line.startsWith('**') && line.endsWith(':**')) {
        const heading = line.replace(/\*\*/g, '');
        return <p key={index} className="font-bold text-lg mt-4">{heading}</p>;
      }
      // Check for hyphen bullet points
      if (line.startsWith('- ')) {
        const point = line.substring(2);
        return (
          <div key={index} className="flex items-start mt-2">
            <span className="text-green-500 text-lg mr-2">•</span>
            <p className="flex-1">{point}</p>
          </div>
        );
      }
      // Handle regular text
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Crop & Soil Prediction Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {inputFields.map(({ name, label }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {label}
              </label>
              <input
                type="number"
                step="any"
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              />
            </div>
          ))}

          <div className="md:col-span-2 flex justify-center mt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict Crop"}
            </button>
          </div>
        </form>

        <div className="mt-10 p-6 border border-green-200 rounded-2xl bg-green-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Prediction Output
          </h3>

          {output ? (
            <div className="space-y-5">
              {output.map((rec, index) => (
                <div
                  key={index}
                  className="p-5 bg-white border rounded-xl shadow-md hover:shadow-lg transition text-left flex flex-col items-center text-center"
                >
                  <p className="font-bold text-green-700 text-lg">
                    {rec.crop}{" "}
                    {rec.probability !== undefined
                      ? `(${(rec.probability * 100).toFixed(2)}%)`
                      : ""}
                  </p>
                  
                  {rec.image_data ? (
                    <div className="mt-4 mb-4 rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={`data:image/png;base64,${rec.image_data}`} 
                        alt={`A thriving ${rec.crop} plant`} 
                        className="w-full h-auto"
                      />
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-gray-400">Image not available.</p>
                  )}

                  {/* Render the markdown formatted description */}
                  <div className="text-gray-700 mt-3 text-left w-full">
                    {renderMarkdown(rec.description)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Submit the form to see predictions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
