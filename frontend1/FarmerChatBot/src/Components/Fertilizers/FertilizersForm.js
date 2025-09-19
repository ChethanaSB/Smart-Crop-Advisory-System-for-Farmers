import React, { useState } from "react";
import { Loader2, Leaf } from "lucide-react";

const Navbar = () => (
  <nav className="bg-white shadow-md w-full py-4 px-6 md:px-12 flex justify-between items-center fixed top-0 z-50">
    <div className="flex items-center gap-2">
      <Leaf className="text-green-600" size={28} />
      <span className="text-xl font-bold text-gray-800">AgroSage</span>
    </div>
    <div className="flex items-center gap-4 text-gray-600 font-medium">
      <a href="/" className="hover:text-green-600 transition">Home</a>
      <a href="/about" className="hover:text-green-600 transition">About</a>
      <a href="/contact" className="hover:text-green-600 transition">Contact</a>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="w-full bg-[#111] text-gray-400 py-8 px-6 md:px-12">
    <div className="max-w-7xl mx-auto text-center">
      <p>AgroSage © 2025. All rights reserved.</p>
      <div className="flex justify-center gap-6 mt-4">
        <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        <a href="/terms" className="hover:text-white">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export default function FertilizerForm() {
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soilType: "Sandy",
    cropType: "Maize",
    nitrogen: "",
    potassium: "",
    phosphorous: "",
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const apiUrl = "http://127.0.0.1:8001/recommend-fertilizer";
      const payload = {
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        moisture: Number(formData.moisture),
        soil_type: formData.soilType,
        crop_type: formData.cropType,
        n: Number(formData.nitrogen),
        p: Number(formData.phosphorous),
        k: Number(formData.potassium),
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "An error occurred.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let firstChunkReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n');
        buffer = parts.pop();

        for (const part of parts) {
          if (part.trim() === "") continue;
          const parsedJson = JSON.parse(part);

          if (parsedJson.error) {
            throw new Error(parsedJson.error);
          }
          
          if (!firstChunkReceived) {
            setIsLoading(false); 
            firstChunkReceived = true;
          }

          setResult(parsedJson);
        }
      }

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg my-20 w-full">
            <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
                Fertilizer Recommendation Form
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Temperature (°C)</label>
                    <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" required />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Humidity (%)</label>
                    <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" required />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Moisture (%)</label>
                    <input type="number" name="moisture" value={formData.moisture} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" required />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Nitrogen (N)</label>
                    <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" required />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Potassium (K)</label>
                    <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" required />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Phosphorous (P)</label>
                    <input type="number" name="phosphorous" value={formData.phosphorous} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" required />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Soil Type</label>
                    <select name="soilType" value={formData.soilType} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" required>
                        <option value="Sandy">Sandy</option>
                        <option value="Loamy">Loamy</option>
                        <option value="Black">Black</option>
                        <option value="Red">Red</option>
                        <option value="Clayey">Clayey</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Crop Type</label>
                    <select name="cropType" value={formData.cropType} onChange={handleChange} className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" required>
                        <option value="Maize">Maize</option>
                        <option value="Sugarcane">Sugarcane</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Tobacco">Tobacco</option>
                        <option value="Paddy">Paddy</option>
                        <option value="Barley">Barley</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Millets">Millets</option>
                        <option value="Oil seeds">Oil seeds</option>
                        <option value="Pulses">Pulses</option>
                        <option value="Ground Nuts">Ground Nuts</option>
                    </select>
                </div>

                <div className="md:col-span-2 flex justify-center">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto flex items-center justify-center gap-2 disabled:bg-gray-400" disabled={isLoading}>
                        {isLoading ? (
                            <> <Loader2 className="animate-spin" size={20} /> Getting Recommendation... </>
                        ) : ( "Get Fertilizer Recommendation" )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-center text-red-800">
                    <h3 className="font-semibold">Request Failed</h3>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="mt-8 p-6 bg-green-50 border-t-4 border-green-500 rounded-b-lg shadow-md">
                    <h3 className="text-xl font-bold text-green-800 text-center mb-4">
                        ✨ Recommended Fertilizer ✨
                    </h3>
                    <div className="text-center mb-4">
                        <p className="text-2xl font-extrabold text-green-900">{result.fertilizer_name}</p>
                    </div>
                    <div className="mt-4 text-gray-700 space-y-2">
                        {result.description.split('\n').map((line, index) => {
                            const trimmedLine = line.trim();
                            if (trimmedLine.startsWith('**')) {
                                return <p key={index} className="font-bold text-lg mt-4 text-gray-800">{trimmedLine.replace(/\*\*/g, '')}</p>;
                            }
                            if (trimmedLine.startsWith('*')) {
                                return <li key={index} className="ml-5 list-disc">{trimmedLine.replace('*', '').trim()}</li>;
                            }
                            return trimmedLine ? <p key={index} className="text-base">{trimmedLine}</p> : <br key={index} />;
                        })}
                    </div>
                </div>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
}