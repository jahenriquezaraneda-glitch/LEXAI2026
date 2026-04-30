import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { CONSULTOR_PROMPT } from '../constants';

interface LexConsultorChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConsultorMessage {
  role: 'user' | 'ai';
  text: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

const welcomeMessage: ConsultorMessage = { 
  role: 'ai', 
  text: "Consultor Técnico LexAI Pro: Historial Purgado. Ingrese la institución jurídica o norma que desea investigar." 
};

const LexConsultorChat: React.FC<LexConsultorChatProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ConsultorMessage[]>([welcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setQuery("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [...history, { role: 'user', parts: [{ text: userText }] }],
        config: {
          systemInstruction: CONSULTOR_PROMPT,
          temperature: 0.2, // Low temperature for highly factual and serious responses
        }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "No se pudo generar una respuesta." }]);
    } catch (error) {
      console.error("Error in Consultor:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error de conexión con la base de datos jurídica. Por favor, intente nuevamente." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // FUNCIÓN DE LIMPIEZA TOTAL
  const handleHardReset = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (window.confirm("¿Desea vaciar el despacho de consultas?")) {
      // 1. Limpiamos el estado de los mensajes (el chat)
      setMessages([welcomeMessage]);
      
      // 2. Limpiamos el estado de la pregunta actual
      setQuery("");
      
      // 3. LIMPIEZA MANUAL DEL DOM (Para asegurar que el texto se borre del cuadro)
      const textArea = document.getElementById("consultor-input") as HTMLTextAreaElement;
      if (textArea) {
        textArea.value = "";
      }
      
      console.log("Sistema purgado manualmente.");
    }
  };

  // Función para Generar Informe (Simulación de PDF/Descarga)
  const downloadReport = () => {
    const disclaimer = `--- CLÁUSULA DE EXENCIÓN DE RESPONSABILIDAD ---
ESTE DOCUMENTO ES UN INFORME GENERADO POR IA. LEXAI PRO NO REALIZA EL TRABAJO DE UN ABOGADO.
EL CREADOR NO SE HACE RESPONSABLE POR EL USO DE ESTA INFORMACIÓN EN PROCESOS JUDICIALES REALES.
--------------------------------------------\n\n`;

    const reportContent = messages.map(m => `${m.role === 'ai' ? 'DICTAMEN LEXAI' : 'CONSULTA USUARIO'}:\n${m.text}\n\n`).join('---\n');
    const finalFile = `${disclaimer}INFORME TÉCNICO LEXAI PRO\nFECHA: ${new Date().toLocaleDateString()}\n\n${reportContent}`;

    const blob = new Blob([finalFile], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LexAI_Informe_Protegido_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-[400px] bg-[#0a0a0a] border-r border-[#D4AF37]/30 shadow-[10px_0_30px_rgba(0,0,0,0.8)] transition-transform duration-700 z-[2000] flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      
      {/* HEADER PREMIUM */}
      <div className="p-6 bg-[#121212] border-b border-[#D4AF37]/20 flex justify-between items-center">
        <div>
          <h3 className="font-titulo text-[#D4AF37] text-sm tracking-[3px]">CONSULTOR TÉCNICO</h3>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Informes de Alta Doctrina</p>
        </div>
        <button onClick={onClose} className="text-[#D4AF37] opacity-50 hover:opacity-100 transition-opacity">✕</button>
      </div>

      {/* ÁREA DE MENSAJES (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#D4AF37]/20">
        {messages.map((m, i) => (
          <div key={`${i}-${m.role}`} className="border-l border-[#D4AF37]/20 pl-4 animate-fadeIn">
            <p className="text-[9px] text-[#D4AF37] font-titulo uppercase tracking-widest mb-1">
              {m.role === 'ai' ? 'Dictamen' : 'Consulta'}
            </p>
            <p className="text-gray-300 font-serif text-sm italic whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="border-l border-[#D4AF37]/20 pl-4 flex items-center gap-2 text-[#D4AF37]">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs italic font-serif">Consultando doctrina y jurisprudencia...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="px-6 py-4 flex gap-2 bg-[#0d0d0d] border-t border-[#D4AF37]/10">
        <button 
          type="button"
          onClick={handleHardReset}
          className="w-12 h-12 flex items-center justify-center border border-red-900/50 hover:bg-red-900/20 text-red-600 transition-all rounded-md"
          title="Limpiar todo"
        >
          🗑️
        </button>
        <button 
          type="button"
          onClick={downloadReport}
          className="flex-1 border border-[#D4AF37]/40 text-[#D4AF37] font-titulo text-[10px] tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all rounded-md"
        >
          GENERAR INFORME PDF
        </button>
      </div>

      {/* INPUT DE CONSULTA */}
      <div className="p-6 bg-[#121212]">
        <textarea 
          id="consultor-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
          className="w-full bg-black border border-[#D4AF37]/20 p-4 text-xs text-white outline-none focus:border-[#D4AF37] font-serif transition-all resize-none disabled:opacity-50"
          placeholder="Escriba aquí su consulta..."
          rows={4}
        />
        <button 
          onClick={handleSend}
          disabled={!query.trim() || isLoading}
          className="w-full mt-2 bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black font-black text-[10px] py-4 uppercase tracking-[3px] hover:brightness-125 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
        >
          SOLICITAR INFORME
        </button>
      </div>
    </div>
  );
};

export default LexConsultorChat;
