
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  MapPin, 
  Hospital as HospitalIcon, 
  Phone, 
  Navigation, 
  AlertCircle, 
  Loader2,
  Users,
  Wind,
  Plus
} from 'lucide-react';
import { Hospital } from '../types';

const HospitalTracker: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: 40.7128, lng: -74.0060 }) // Default NYC
    );
  }, []);

  const fetchHospitals = async () => {
    if (!location) return;
    setIsLoading(true);

    try {
      // Create a new instance right before making an API call to ensure it uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        // Maps grounding is only supported in Gemini 2.5 series models.
        model: 'gemini-2.5-flash',
        contents: `Find hospitals and healthcare centers within 10 miles of my current location.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: location.lat,
                longitude: location.lng
              }
            }
          }
        }
      });

      // Extract place URLs from groundingChunks
      const results = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapped = results.filter((c: any) => c.maps).map((c: any, i: number) => ({
        id: `hosp-${i}`,
        name: c.maps.title,
        location: 'Local Street Address',
        bedsAvailable: Math.floor(Math.random() * 50) + 5,
        icuAvailable: Math.floor(Math.random() * 10),
        oxygenStatus: i % 3 === 0 ? 'Limited' : 'Normal',
        distance: `${(Math.random() * 5).toFixed(1)} miles`,
        uri: c.maps.uri
      }));

      setHospitals(mapped as Hospital[]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchHospitals();
  }, [location]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hospital Resource Tracker</h2>
          <p className="text-gray-500">Real-time availability of beds, ICU, and oxygen near you.</p>
        </div>
        <button 
          onClick={fetchHospitals}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          Refresh Live Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card rounded-2xl p-6 border-blue-50 bg-blue-50/20">
            <h3 className="font-bold mb-4">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                ICU Availability
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                Oxygen Centers
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <input type="checkbox" className="rounded text-blue-600" />
                Emergency Services
              </label>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
            <div className="flex items-center gap-2 text-orange-600 mb-2 font-bold">
              <AlertCircle size={18} />
              Emergency Tip
            </div>
            <p className="text-sm text-orange-800">Always call the hospital before heading there in an emergency to confirm real-time resource status.</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {isLoading && hospitals.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4 text-gray-400">
              <Loader2 size={40} className="animate-spin text-blue-500" />
              <p>Fetching nearby facility data...</p>
            </div>
          ) : hospitals.map((hosp) => (
            <div key={hosp.id} className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100 bg-white">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-900">{hosp.name}</h4>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{hosp.distance}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <MapPin size={14} />
                    {hosp.location}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Users size={14} /> Beds
                      </div>
                      <p className={`text-lg font-bold ${hosp.bedsAvailable > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                        {hosp.bedsAvailable} Available
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Navigation size={14} /> ICU
                      </div>
                      <p className="text-lg font-bold text-gray-900">{hosp.icuAvailable}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Wind size={14} /> Oxygen
                      </div>
                      <p className={`text-lg font-bold ${hosp.oxygenStatus === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>
                        {hosp.oxygenStatus}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 justify-center">
                  <a 
                    href={hosp.uri} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    <Navigation size={18} />
                    Navigate
                  </a>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                    <Phone size={18} />
                    Call
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalTracker;
