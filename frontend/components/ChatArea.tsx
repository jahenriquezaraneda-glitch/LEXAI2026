import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Command, FileText, RefreshCw, Gavel } from 'lucide-react';
import { Message, CommandType, SimulationState } from '../types';
import MessageBubble from './MessageBubble';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  simState: SimulationState;
  onRestart: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, isLoading, simState, onRestart }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim() && !isLoading && simState.currentRound <= 4) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleCommandClick = (cmd: CommandType) => {
    setInputValue((prev) => (prev ? `${prev} ${cmd} ` : `${cmd} `));
  };

  const commands: { cmd: CommandType; label: string }[] = [
    { cmd: '/redactar', label: 'Redactar' },
    { cmd: '/analizar', label: 'Analizar' },
    { cmd: '/doctrina', label: 'Doctrina' },
    { cmd: '/coach', label: 'Coach' },
  ];

  const isFinished = simState.currentRound > 4;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-transparent">
      
      {/* Header */}
      <div className="bg-[#121212]/95 backdrop-blur-md border-b border-[#2C2C2C] p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#D4AF37] flex items-center gap-2 font-titulo">
            Sala de Litigación Virtual
            <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-1 rounded-full font-semibold font-sans">
              Ronda {Math.min(simState.currentRound, 4)}/4
            </span>
          </h1>
          <p className="text-sm text-[#A3A3A3] italic">
            {simState.matter} | Rol: {simState.role} | Modo: {simState.mode}
          </p>
        </div>
        <button 
          onClick={onRestart}
          className="p-2 text-[#A3A3A3] hover:text-[#D4AF37] hover:bg-[#2C2C2C] rounded-full transition-colors"
          title="Reiniciar Simulación"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Case Description Card */}
        {simState.caseDescription && (
          <div className="bg-[#1A1A1A]/95 backdrop-blur-sm border border-[#2C2C2C] border-l-4 border-l-[#D4AF37] shadow-lg rounded-r-xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-[#D4AF37]">
              <Gavel size={120} />
            </div>
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2 mb-3 border-b border-[#2C2C2C] pb-2 font-titulo">
              <FileText size={18} />
              Expediente Oficial del Caso
            </h2>
            <p className="text-[#E5E5E5] text-sm leading-relaxed whitespace-pre-wrap">
              {simState.caseDescription}
            </p>
          </div>
        )}

        {messages.map((msg) => <MessageBubble key={msg.id} message={msg} onRestart={onRestart} />)}
        
        {isLoading && (
          <div className="flex justify-start mb-8">
            <div className="bg-[#1A1A1A]/95 backdrop-blur-sm border border-[#D4AF37]/30 shadow-sm rounded-2xl rounded-tl-none p-4 flex items-center gap-3 text-[#D4AF37]">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-medium animate-pulse font-titulo">LexAI Pro está analizando los autos...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#121212]/95 backdrop-blur-md border-t border-[#2C2C2C]">
        {!isFinished && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {commands.map(({ cmd, label }) => (
              <button
                key={cmd}
                onClick={() => handleCommandClick(cmd)}
                className="px-3 py-1.5 bg-[#2C2C2C] hover:bg-[#4A4A4A] text-[#D4AF37] text-xs font-semibold rounded-full border border-[#4A4A4A] transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <span className="text-[#A3A3A3]">/</span>{label}
              </button>
            ))}
          </div>
        )}
        
        <div className="mt-2 space-y-2">
          <label className="text-[10px] font-black uppercase text-[#A3A3A3] tracking-widest ml-2 font-titulo">Tu Argumento / Comando</label>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isFinished || isLoading}
            className="w-full min-h-[180px] p-6 text-[#E5E5E5] bg-[#1A1A1A] border-2 border-[#2C2C2C] rounded-2xl focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 outline-none transition-all shadow-sm disabled:bg-[#121212] disabled:text-[#4A4A4A] resize-none"
            placeholder={isFinished ? "Simulación finalizada. Presione el botón de reinicio arriba para comenzar de nuevo." : "Redacte su fundamento legal... (Use /coach para táctica, /doctrina para citas. Ctrl+Enter para enviar)"}
          />
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] text-[#A3A3A3] italic">Pista: Enter para nueva línea. Ctrl+Enter para enviar.</span>
            <button 
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading || isFinished}
              className="bg-[#D4AF37] text-[#121212] px-8 py-2 rounded-full font-bold text-sm hover:bg-[#996515] hover:text-white hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-titulo"
            >
              ENVIAR ARGUMENTO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
