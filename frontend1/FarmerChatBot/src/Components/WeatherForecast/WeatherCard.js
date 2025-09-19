import React, { useState, useEffect } from "react";
import { CloudRain, Wind, Sun, Cloudy, MapPin, Leaf, CheckCircle, AlertTriangle } from "lucide-react";

// ▼▼▼ PASTE YOUR OPENWEATHERMAP API KEY HERE ▼▼▼
const WEATHER_API_KEY = "1997e2994ec1188218cac725181c7a0d";
// ▲▲▲ PASTE YOUR OPENWEATHERMAP API KEY HERE ▲▲▲

// --- Data for Dropdowns ---
const crops = [
  "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soybean", "Groundnut", 
  "Mustard", "Jute", "Tea", "Coffee", "Coconut", "Potato", "Onion", 
  "Tomato", "Mango", "Banana", "Pulses", "Millets", "Barley"
];

const districtsByState = {
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Kanchipuram", "Tiruchirappalli", "Salem", "Vellore"],
  "Uttar Pradesh": ["Lucknow", "Kanpur Nagar", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
};

const allDistricts = Object.values(districtsByState).flat().sort();

const WeatherIcon = ({ weather, ...props }) => {
    if (!weather) return <Cloudy {...props} />;
    const main = weather.main.toLowerCase();
    if (main.includes("rain")) return <CloudRain {...props} />;
    if (main.includes("clear")) return <Sun {...props} />;
    return <Cloudy {...props} />;
};

// --- New Advisory Logic Functions ---
const getAdvisory = (crop, day) => {
  const { maxTemp, minTemp, totalRain, weather, windSpeed, humidity } = day;
  const advisories = [];

  // General recommendations for all crops
  if (totalRain > 10) {
    advisories.push(`Heavy rainfall is expected. Avoid spraying pesticides or fertilizers today. 🌧️`);
  } else if (totalRain > 1) {
    advisories.push(`Light rain is expected. This may be a good day for irrigation, but check soil moisture.`);
  }

  if (windSpeed > 20) { // Threshold in km/h
    advisories.push(`Very strong winds may damage crops. Secure structures and avoid spraying. 🌬️`);
  } else if (windSpeed > 10) {
    advisories.push(`Moderate winds. Be cautious when spraying as it may not be effective. 💨`);
  }

  if (maxTemp > 35) {
    advisories.push(`High temperatures may cause heat stress. Ensure adequate irrigation. 💧`);
  }
  if (minTemp < 5) {
      advisories.push(`Low temperatures may cause frost damage. Take protective measures for sensitive crops. ❄️`);
  }

  if (weather.main.includes('Clouds') && humidity > 70) {
    advisories.push(`High humidity with cloudy conditions. Monitor for signs of fungal diseases. ☁️`);
  }

  // Crop-specific recommendations
  if (crop === "Rice") {
    if (totalRain > 10) advisories.push(`Rice: Good day for natural irrigation, but check for waterlogging.`);
    if (maxTemp > 30) advisories.push(`Rice: Maintain water levels in the paddy fields to prevent heat stress.`);
  } else if (crop === "Wheat") {
    if (totalRain > 2) advisories.push(`Wheat: Avoid irrigation as wet conditions can promote rust diseases.`);
    if (windSpeed > 10) advisories.push(`Wheat: Strong winds can cause lodging (flattening of the crop).`);
  } else if (crop === "Cotton") {
    if (totalRain > 5) advisories.push(`Cotton: Excessive rain can lead to boll rot. Ensure proper drainage.`);
  }

  return advisories.length > 0 ? advisories : ["Weather is favorable for general fieldwork. 🌿"];
};

const getSuitableDay = (forecast) => {
  if (!forecast || forecast.length === 0) return null;

  const suitableDay = forecast.find(day => {
    // Criteria for a suitable day: low rain, low wind, moderate temperature
    const isLowRain = day.totalRain < 2;
    const isLowWind = (day.windSpeed * 3.6) < 10; // Convert m/s to km/h
    const isModerateTemp = day.maxTemp >= 15 && day.maxTemp <= 30;

    return isLowRain && isLowWind && isModerateTemp;
  });

  return suitableDay ? suitableDay.date : null;
};

export default function App() {
  const [selectedDistrict, setSelectedDistrict] = useState("Bengaluru");
  const [selectedCrop, setSelectedCrop] = useState("Rice");

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedDistrict) return;
      
      setLoading(true);
      setError(null);
      
      if (WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        setError("Please add your OpenWeatherMap API key.");
        setLoading(false);
        return;
      }

      try {
        const [currentRes, forecastRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedDistrict}&appid=${WEATHER_API_KEY}&units=metric`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedDistrict}&appid=${WEATHER_API_KEY}&units=metric`)
        ]);

        if (!currentRes.ok) throw new Error(`Could not fetch weather for "${selectedDistrict}". Check the city name.`);
        if (!forecastRes.ok) throw new Error("Could not fetch forecast data.");
        
        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();
        
        setCurrentWeather(currentData);
        setForecast(processForecastData(forecastData.list));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedDistrict]);

  const processForecastData = (list) => {
    const dailyData = {};
    const today = new Date().toISOString().split('T')[0];

    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (date === today) return;

      if (!dailyData[date]) {
        dailyData[date] = { temps: [], rains: [], weathers: [], windSpeeds: [], humidities: [] };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].weathers.push(item.weather[0]);
      dailyData[date].windSpeeds.push(item.wind.speed);
      dailyData[date].humidities.push(item.main.humidity);
      if (item.rain && item.rain['3h']) {
        dailyData[date].rains.push(item.rain['3h']);
      }
    });

    return Object.keys(dailyData).slice(0, 5).map(date => {
      const day = dailyData[date];
      const dominantWeather = day.weathers.sort((a,b) => day.weathers.filter(v => v.id === a.id).length - day.weathers.filter(v => v.id === b.id).length).pop();
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        minTemp: Math.min(...day.temps),
        maxTemp: Math.max(...day.temps),
        totalRain: day.rains.reduce((a, b) => a + b, 0),
        windSpeed: Math.max(...day.windSpeeds), // Get max wind speed for the day
        humidity: Math.max(...day.humidities),
        weather: dominantWeather
      };
    });
  };

  const todayAdvisory = currentWeather ? getAdvisory(selectedCrop, {
    maxTemp: currentWeather.main.temp,
    minTemp: currentWeather.main.temp,
    totalRain: currentWeather.rain?.['1h'] || 0,
    weather: currentWeather.weather[0],
    windSpeed: currentWeather.wind.speed,
    humidity: currentWeather.main.humidity
  }) : [];

  const suitableDay = getSuitableDay(forecast);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Live Weather Dashboard</h1>
        
        <div className="p-6 bg-white rounded-lg shadow-md mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                {allDistricts.map(district => <option key={district} value={district}>{district}</option>)}
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
            <div className="relative">
              <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="crop-select"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                {crops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading && <div className="text-center p-6">Loading forecast for {selectedDistrict}...</div>}
        {error && <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        
        {currentWeather && !loading && !error && (
          <>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md mb-6">
              <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2 mb-4">
                <WeatherIcon weather={currentWeather.weather[0]} className="w-6 h-6 text-blue-600" />
                Weather Forecast for {currentWeather.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Temperature</p>
                  <p className="text-lg font-bold">{Math.round(currentWeather.main.temp)}°C</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Humidity</p>
                  <p className="text-lg font-bold">{currentWeather.main.humidity}%</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Wind</p>
                  <p className="text-lg font-bold flex items-center justify-center gap-1">
                    <Wind className="w-4 h-4" /> {(currentWeather.wind.speed * 3.6).toFixed(1)} km/h
                  </p>
                </div>
                <div className="bg-white shadow rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Rainfall (1hr)</p>
                  <p className="text-lg font-bold">{currentWeather.rain?.['1h'] || 0} mm</p>
                </div>
              </div>
            </div>

            {/* Agricultural Advisory Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
                Agricultural Advisory for {selectedCrop}
              </h2>
              <ul className="space-y-2">
                {todayAdvisory.map((advice, index) => (
                  <li key={index} className={`flex items-start gap-2 ${advice.includes('Avoid') || advice.includes('damage') ? 'text-red-600' : 'text-green-800'}`}>
                    {advice.includes('Avoid') || advice.includes('damage') ? <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" /> : <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" />}
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Best day for fieldwork:</span> {suitableDay ? suitableDay : "No suitable day found in the 5-day forecast."}
                </p>
              </div>
            </div>

            {/* 5-Day Forecast Section */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5-Day Forecast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {forecast.map((day) => (
                  <div key={day.date} className="bg-gray-50 shadow rounded-lg p-4 text-center">
                    <p className="font-medium text-gray-700">{day.date}</p>
                    <WeatherIcon weather={day.weather} className="w-8 h-8 text-blue-600 mx-auto my-2" />
                    <p className="text-sm text-gray-600 capitalize">{day.weather.description}</p>
                    <p className="font-bold mt-2 text-lg text-gray-900">{Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°</p>
                    <p className="text-blue-600 text-sm mt-1">💧 {day.totalRain.toFixed(1)}mm rain</p>
                    <p className="text-gray-500 text-sm mt-1">💨 {(day.windSpeed * 3.6).toFixed(1)} km/h</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}