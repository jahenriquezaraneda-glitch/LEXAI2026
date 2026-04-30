import React, { useState } from 'react';
import { Message, LexAIResponse, EvaluationResult } from '../types';
import { User, Gavel, BookOpen, BrainCircuit, PenTool, Target, Award } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  onRestart?: () => void;
}

type TabType = 'analisis' | 'coach' | 'desafio' | 'borrador';

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRestart }) => {
  const [activeTab, setActiveTab] = useState<TabType>('analisis');
  const [copyBtnText, setCopyBtnText] = useState("COPIAR BORRADOR PROFESIONAL");
  
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 w-full max-w-5xl mx-auto">
        <div className="max-w-[80%] bg-[#2C2C2C] border border-[#4A4A4A] shadow-md rounded-2xl rounded-tr-none p-4 text-[#E5E5E5]">
          <div className="flex items-center gap-2 mb-2 text-[#D4AF37] font-semibold border-b border-[#4A4A4A] pb-2 font-titulo">
            <User size={16} />
            <span>Abogado Consultante</span>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content as string}</p>
        </div>
      </div>
    );
  }

  if (message.type === 'evaluation') {
    const evalData = message.content as EvaluationResult;
    
    const renderScore = (score: number) => {
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((star) => (
            <div 
              key={star} 
              className={`h-2 w-8 rounded-full ${star <= score ? 'bg-[#D4AF37]' : 'bg-[#4A4A4A]'}`}
            />
          ))}
        </div>
      );
    };

    return (
      <div className="flex justify-start mb-8 w-full max-w-5xl mx-auto">
        <div className="w-full max-w-4xl bg-[#1A1A1A] border-2 border-[#D4AF37] shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-[#121212] text-[#D4AF37] px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/30">
            <div className="flex items-center gap-3 font-bold text-lg font-titulo">
              <Award size={24} className="text-[#D4AF37]" />
              <span>Evaluación Final de Simulación</span>
            </div>
            <span className="text-xs bg-[#2C2C2C] px-3 py-1 rounded-full border border-[#4A4A4A] text-[#E5E5E5]">LexAI Pro Analytics</span>
          </div>
          
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#E5E5E5] flex items-center gap-2"><Gavel size={16} className="text-[#D4AF37]"/> Jurisprudencia</span>
                  <span className="text-sm font-bold text-[#D4AF37]">{evalData.jurisprudencia}/4</span>
                </div>
                {renderScore(evalData.jurisprudencia)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#E5E5E5] flex items-center gap-2"><BookOpen size={16} className="text-[#D4AF37]"/> Doctrina</span>
                  <span className="text-sm font-bold text-[#D4AF37]">{evalData.doctrina}/4</span>
                </div>
                {renderScore(evalData.doctrina)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#E5E5E5] flex items-center gap-2"><BrainCircuit size={16} className="text-[#D4AF37]"/> Pensamiento Crítico</span>
                  <span className="text-sm font-bold text-[#D4AF37]">{evalData.pensamientoCritico}/4</span>
                </div>
                {renderScore(evalData.pensamientoCritico)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#E5E5E5] flex items-center gap-2"><PenTool size={16} className="text-[#D4AF37]"/> Redacción/Técnica</span>
                  <span className="text-sm font-bold text-[#D4AF37]">{evalData.redaccion}/4</span>
                </div>
                {renderScore(evalData.redaccion)}
              </div>
            </div>

            <div className="bg-[#121212] border border-[#2C2C2C] rounded-xl p-5">
              <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-3 flex items-center gap-2 font-titulo">
                <Target size={18} />
                Plan de Estudio Recomendado
              </h3>
              <p className="text-[#E5E5E5] text-sm leading-relaxed whitespace-pre-wrap">
                {evalData.planEstudio}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle AI Response (LexAIResponse)
  const data = message.content as LexAIResponse;

  const handleCopy = (text: string) => {
    const cleanText = text.replace(/```[a-z]*\n|```/g, '').trim();
    navigator.clipboard.writeText(cleanText);
    setCopyBtnText("¡COPIADO!");
    setTimeout(() => setCopyBtnText("COPIAR BORRADOR PROFESIONAL"), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#1A1A1A] rounded-xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden mt-6 mb-8">
      
      <div className="flex bg-[#0a0a0a] border-b border-[#D4AF37]/20">
        {['analisis', 'coach', 'desafio', 'borrador'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`flex-1 py-5 text-[10px] font-titulo uppercase tracking-[2px] transition-all
             ${activeTab === tab 
              ? 'text-[#D4AF37] bg-[#1a1a1a] border-b-2 border-[#D4AF37]' 
              : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-8 min-h-[400px] animate-in fade-in duration-300">
        {activeTab === 'analisis' && (
          <div className="prose max-w-none text-[#E5E5E5] leading-relaxed">
            <h3 className="text-[#D4AF37] font-bold mb-4 uppercase text-sm tracking-widest font-titulo">Evaluación de Colega Senior</h3>
            <div className="whitespace-pre-line">{data.examinerAnalysis}</div>
            
            {/* References */}
            {data.references && data.references.length > 0 && (
              <div className="pt-6 mt-6 border-t border-[#2C2C2C]">
                <h3 className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wider mb-3 font-titulo">Fuentes Invocadas</h3>
                <div className="flex flex-wrap gap-2">
                  {data.references.map((ref, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#2C2C2C] text-[#D4AF37] text-xs rounded-md border border-[#4A4A4A] font-medium">
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'coach' && (
          <div className="bg-[#121212] border-l-4 border-[#D4AF37] p-6 rounded-r-xl">
            <h3 className="text-[#D4AF37] font-bold mb-2 flex items-center gap-2 font-titulo">
              <span>🥊</span> Táctica de Audiencia
            </h3>
            <p className="text-[#E5E5E5] italic text-lg leading-snug">"{data.coachAdvice}"</p>
          </div>
        )}

        {activeTab === 'desafio' && (
          <div className="bg-[#121212] border-l-4 border-[#996515] p-6 rounded-r-xl">
            <h3 className="text-[#D4AF37] font-bold mb-2 font-titulo">🧠 Punto de Inflexión Jurídica</h3>
            <p className="text-[#E5E5E5] font-medium">{data.criticalChallenge}</p>
          </div>
        )}

        {activeTab === 'borrador' && (
          <div className="relative">
            {(!data.exampleDraft || data.exampleDraft === 'N/A' || data.exampleDraft.trim() === '') ? (
              <div className="text-sm text-[#A3A3A3] italic text-center py-8 bg-[#121212] rounded-lg border border-dashed border-[#4A4A4A]">
                No hay borrador disponible para este turno. Continúe el debate para generar uno.
              </div>
            ) : (
              <>
                <div className="bg-[#0A0A0A] rounded-lg p-6 font-mono text-[13px] text-[#D4AF37] leading-relaxed shadow-inner overflow-y-auto max-h-[500px] border border-[#2C2C2C]">
                  <pre className="whitespace-pre-wrap">{data.exampleDraft.replace(/```[a-z]*\n|```/g, '').trim()}</pre>
                </div>
                <button 
                  id="copy-btn"
                  onClick={() => handleCopy(data.exampleDraft)}
                  className="mt-4 w-full bg-[#D4AF37] hover:bg-[#996515] text-[#121212] py-4 rounded-xl font-black text-sm tracking-widest transition-all shadow-lg active:scale-[0.98] font-titulo"
                >
                  {copyBtnText}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {onRestart && (
        <div className="p-4 bg-[#121212] border-t border-[#2C2C2C] flex justify-end">
          <button 
            onClick={onRestart}
            className="text-[#A3A3A3] hover:text-[#D4AF37] text-xs font-bold uppercase flex items-center gap-2 transition-colors font-titulo"
          >
            <span>🔄</span> Reiniciar Simulación del Caso
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
