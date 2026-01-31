
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { X, Mic, MicOff, Waves, Volume2, ShieldAlert } from 'lucide-react';
import { decode, encode, decodeAudioData } from '../services/audio-utils';

interface VoiceAssistantProps {
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [status, setStatus] = useState<'connecting' | 'listening' | 'speaking' | 'idle'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setStatus('connecting');
    setIsActive(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: "You are CureLink Assistant. Help the user with health information, symptoms awareness, and finding nearby hospitals. Be concise, empathetic, and always add a medical disclaimer for diagnosis-related questions.",
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setStatus('speaking');
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error("Live API Error:", e),
          onclose: () => setIsActive(false),
        }
      });

      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('idle');
      setIsActive(false);
    }
  };

  const stopSession = () => {
    sessionPromiseRef.current?.then(s => s.close());
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    setIsActive(false);
    setStatus('idle');
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative glass-card w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 text-center space-y-6">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="w-24 h-24 mx-auto relative flex items-center justify-center">
            {status === 'connecting' || status === 'speaking' || status === 'listening' ? (
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
            ) : null}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
              isActive ? 'bg-blue-600 text-white scale-110' : 'bg-gray-100 text-gray-400'
            }`}>
              {status === 'speaking' ? <Volume2 size={40} /> : <Mic size={40} />}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {status === 'connecting' ? 'Initializing...' : 
               status === 'listening' ? 'Listening...' :
               status === 'speaking' ? 'CureLink is speaking...' :
               'Hands-Free Health Assistant'}
            </h2>
            <p className="text-gray-500 mt-2">Speak naturally to ask health questions or find resources.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 min-h-[120px] max-h-[200px] overflow-y-auto text-left relative">
            {transcription ? (
              <p className="text-gray-700 italic leading-relaxed">"{transcription}"</p>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 space-y-2">
                <Waves size={32} />
                <p className="text-sm font-medium">Wait for signal to speak</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={isActive ? stopSession : startSession}
              className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg ${
                isActive 
                ? 'bg-red-50 text-red-600 border border-red-100' 
                : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
              }`}
            >
              {isActive ? (
                <>
                  <MicOff size={24} /> Stop Session
                </>
              ) : (
                <>
                  <Mic size={24} /> Start Voice Session
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 uppercase tracking-widest font-bold border-t pt-4">
            <ShieldAlert size={12} className="text-orange-500" />
            AI Voice Awareness Tool · No Diagnosis
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
