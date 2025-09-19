import React, { useState, useEffect } from "react";

// --- Configuration ---
const API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
const API_BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const StateMarketView = () => {
  const [availableCommodities, setAvailableCommodities] = useState([]);
  const [commodity, setCommodity] = useState("");
  
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This useEffect fetches all available commodities and populates the dropdown.
  useEffect(() => {
    const fetchAllCommodities = async () => {
      setLoading(true);
      setError(null);
      const url = `${API_BASE_URL}?api-key=${API_KEY}&format=json&limit=50000`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data.records) {
          const uniqueCommodities = [...new Set(data.records.map(r => r.commodity))].sort();
          setAvailableCommodities(uniqueCommodities);
          if (uniqueCommodities.length > 0) {
            setCommodity(uniqueCommodities[0]); // Set the first commodity as default
          }
        }
      } catch (e) {
        setError("Failed to fetch the list of available crops from the API.");
        console.error(e);
      }
    };

    fetchAllCommodities();
  }, []);

  // This useEffect fetches and processes market data for the selected commodity.
  useEffect(() => {
    const fetchPricesForCommodity = async () => {
      if (!commodity) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setMarketData([]);

      const url = `${API_BASE_URL}?api-key=${API_KEY}&format=json&limit=10000&filters[commodity]=${commodity}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        if (data.records && data.records.length > 0) {
          const processedData = processStateData(data.records);
          setMarketData(processedData);
        }
      } catch (e) {
        setError("Failed to fetch market data for the selected crop.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPricesForCommodity();
  }, [commodity]);

  const processStateData = (records) => {
    const statesData = {};
    
    for (const record of records) {
      if (!statesData[record.state]) {
        statesData[record.state] = [];
      }
      statesData[record.state].push({
        price: parseInt(record.modal_price, 10),
        date: new Date(record.arrival_date).toLocaleDateString('en-CA') // YYYY-MM-DD format
      });
    }

    const finalStateData = [];
    for (const stateName in statesData) {
      const stateRecords = statesData[stateName].filter(r => !isNaN(r.price) && r.price > 0);
      if (stateRecords.length === 0) continue;

      const latestDate = stateRecords.reduce((max, r) => r.date > max ? r.date : max, stateRecords[0].date);
      const latestRecords = stateRecords.filter(r => r.date === latestDate);
      
      const avgPricePerQuintal = latestRecords.reduce((sum, r) => sum + r.price, 0) / latestRecords.length;
      
      // Safety check to ensure the calculated price is a valid number
      if (!isNaN(avgPricePerQuintal)) {
        const avgPricePerKg = avgPricePerQuintal / 100;
        const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };

        finalStateData.push({
          state: stateName,
          avgPricePerKg: avgPricePerKg,
          avgPricePerQuintal: avgPricePerQuintal,
          latestDate: new Date(latestDate).toLocaleDateString('en-GB', dateOptions)
        });
      }
    }
    return finalStateData.sort((a,b) => b.avgPricePerKg - a.avgPricePerKg);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5 mt-16">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-3">
            All-India Market Tracker
          </h1>
          <p className="text-gray-600">
            State-wise average prices for major agricultural commodities.
          </p>
        </header>

        <div className="max-w-md mx-auto mb-10">
          <label htmlFor="commodity-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Commodity
          </label>
          <select
            id="commodity-select"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            disabled={loading && availableCommodities.length === 0}
            className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            {availableCommodities.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {loading && <p className="text-center">Loading data...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && marketData.length === 0 && (
          <p className="text-center text-gray-500">No recent price data found for {commodity}.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {marketData.map(stateData => (
            <div key={stateData.state} className="bg-white rounded-lg shadow-md p-3 border-l-4 border-blue-500">
              <h3 className="font-bold text-base text-gray-800 truncate">{stateData.state}</h3>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Most Recent Avg. Price</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{stateData.avgPricePerKg.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-sm font-normal"> / Kg</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (₹{stateData.avgPricePerQuintal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / Quintal)
                </p>
                <p className="text-xs text-gray-400 mt-2">As of {stateData.latestDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StateMarketView;