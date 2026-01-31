
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Camera, Upload, ShieldAlert, CheckCircle2, Loader2, Info, AlertTriangle } from 'lucide-react';

const SymptomChecker: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = selectedImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: `Identify potential skin conditions, eye infections, or visible symptoms in this image. 
              Explain what the visible signs might indicate for awareness purposes. 
              MANDATORY DISCLAIMER: State clearly that this is NOT a medical diagnosis and the user MUST consult a doctor.` }
          ]
        }
      });

      setAnalysis(response.text || "Analysis failed. Please try a clearer image.");
    } catch (error) {
      console.error(error);
      setAnalysis("Error analyzing the image. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Visual Symptom Check</h2>
        <p className="text-gray-500">Upload a clear photo of a visible symptom (rash, eye infection, etc.) for preliminary awareness support.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className={`relative border-2 border-dashed rounded-3xl h-96 flex flex-col items-center justify-center transition-all ${
            selectedImage ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}>
            {selectedImage ? (
              <div className="relative w-full h-full p-4">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                >
                  <AlertTriangle size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer p-8 text-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Camera size={40} />
                </div>
                <span className="text-lg font-bold text-gray-900">Upload Health Photo</span>
                <span className="text-sm text-gray-500 mt-2">Supports JPG, PNG</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          <button
            onClick={analyzeImage}
            disabled={!selectedImage || isAnalyzing}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-300 transition-all disabled:shadow-none"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <ShieldAlert size={24} />
                Start AI Awareness Check
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="flex flex-col">
          <div className="glass-card rounded-3xl p-6 flex-1 border border-gray-100 overflow-y-auto max-h-[500px]">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
              <Info size={20} />
              AI Analysis Result
            </div>

            {!analysis && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8">
                <Upload size={48} className="mb-4 opacity-20" />
                <p>Select an image and click analyze to see potential health insights.</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                <div className="prose prose-sm prose-blue max-w-none whitespace-pre-wrap leading-relaxed text-gray-700">
                  {analysis}
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-blue-900">Recommended Steps</h4>
                    <p className="text-xs text-blue-700 mt-1">Visit your dermatologist for a patch test and clinical diagnosis.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="font-bold text-red-900 mb-1">Medical Disclaimer</h3>
          <p className="text-sm text-red-800 leading-relaxed opacity-90">
            This AI tool provides visual health awareness only. It is not capable of medical diagnosis. Never ignore professional medical advice or delay seeking it because of something you have read or seen on this platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
