
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Search, Loader2, Info, ExternalLink, ShieldAlert } from 'lucide-react';

const DiseaseSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', content: string, links?: {web: {uri: string, title: string}}[]}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userQuery = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userQuery,
        config: {
          systemInstruction: `You are a medical awareness expert for the platform CureLink. 
          Your goal is to provide reliable health information based on trusted sources like WHO and CDC.
          Explain symptoms and diseases in simple, accessible language.
          CRITICAL: Include a disclaimer that you are an AI assistant and users should consult a doctor for diagnosis.
          Always use Google Search for up-to-date regional outbreaks if relevant.`,
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "I'm sorry, I couldn't process that health query. Please try again.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: text, 
        links: chunks.filter((c: any) => c.web).map((c: any) => c)
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Error connecting to the health engine. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 max-w-5xl mx-auto">
      <div className="glass-card rounded-2xl p-6 flex items-center justify-between border-blue-100 bg-blue-50/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Disease Information Engine</h2>
            <p className="text-sm text-gray-500">Ask about symptoms, prevention, or regional health alerts.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs bg-white border px-3 py-1.5 rounded-full text-gray-500 font-medium shadow-sm">
          <Info size={14} className="text-blue-500" />
          Verified Sources Only
        </div>
      </div>

      <div className="flex-1 overflow-hidden glass-card rounded-2xl flex flex-col border border-gray-100 bg-white">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-lg font-bold">How can I help you today?</h3>
              <p className="text-gray-500 max-w-sm">"What are the early symptoms of Dengue?"<br/>"Nearby influenza clinics in New York"<br/>"How to prevent food poisoning?"</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border text-gray-800 rounded-tl-none'
              }`}>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {msg.content}
                </div>
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sources & Further Reading</p>
                    {msg.links.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-blue-600 hover:underline bg-blue-50 p-2 rounded-lg"
                      >
                        <ExternalLink size={12} />
                        <span className="truncate">{link.web.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-blue-600" />
                <span className="text-sm text-gray-500 italic">CureLink AI is researching...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSearch} className="p-4 bg-white border-t flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symptoms, outbreaks, or health info..."
            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 transition-colors shadow-lg shadow-blue-200"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-4">
        <div className="text-orange-600 shrink-0">
          <Info size={20} />
        </div>
        <p className="text-sm text-orange-800 leading-relaxed">
          <strong>Important:</strong> CureLink is an awareness platform. The information provided is for educational purposes and is not a clinical diagnosis. In case of emergency, please contact local emergency services or visit a hospital immediately.
        </p>
      </div>
    </div>
  );
};

export default DiseaseSearch;
