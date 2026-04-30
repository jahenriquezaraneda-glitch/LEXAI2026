import React from 'react';
import { BookOpen, Scale, FileText, ChevronRight, ChevronLeft, Gavel } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpenConsultor: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onOpenConsultor }) => {
  const navItems = [
    { icon: <BookOpen size={24} />, label: 'Normativa', desc: 'Códigos y Leyes' },
    { icon: <Scale size={24} />, label: 'Jurisprudencia', desc: 'Corte Suprema & Apelaciones' },
    { icon: <FileText size={24} />, label: 'Doctrina', desc: 'Tratados Nacionales' },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#121212]/60 backdrop-blur-md border-r border-[#D4AF37]/20 text-[#E5E5E5] transition-all duration-300 z-20 flex flex-col shadow-2xl ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#D4AF37]/20 h-16">
        {isOpen && (
          <div className="flex items-center gap-2 font-bold text-xl font-titulo text-[#D4AF37]">
            <Gavel size={24} className="text-[#D4AF37]" />
            <span>LexAI Pro</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-[#D4AF37]/10 text-[#D4AF37] rounded-md transition-colors mx-auto"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2">
        {navItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-4 py-3 hover:bg-[#D4AF37]/10 cursor-pointer transition-colors group relative"
            title={!isOpen ? item.label : undefined}
          >
            <div className="min-w-[24px] flex justify-center text-[#D4AF37]">{item.icon}</div>
            {isOpen && (
              <div className="ml-4 flex flex-col overflow-hidden whitespace-nowrap">
                <span className="font-semibold text-sm text-[#E5E5E5]">{item.label}</span>
                <span className="text-xs text-[#A3A3A3]">{item.desc}</span>
              </div>
            )}
          </div>
        ))}

        <div className="mt-auto mb-4">
           <button 
            onClick={onOpenConsultor}
            className={`flex items-center gap-3 p-4 w-full border-y border-[#D4AF37]/10 hover:bg-[#D4AF37]/5 transition-all group ${!isOpen ? 'justify-center' : ''}`}
            title={!isOpen ? "Consultor Técnico" : undefined}
          >
            <div className="w-8 h-8 flex items-center justify-center border border-[#D4AF37]/50 rounded-full group-hover:bg-[#D4AF37] shrink-0">
              <span className="text-[#D4AF37] group-hover:text-black text-xs">🏛️</span>
            </div>
            {isOpen && (
              <div className="text-left overflow-hidden whitespace-nowrap">
                <p className="font-titulo text-[10px] text-[#D4AF37]">CONSULTOR TÉCNICO</p>
                <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Investigación y Doctrina</p>
              </div>
            )}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4 text-xs text-[#A3A3A3] border-t border-[#D4AF37]/20 text-center font-titulo">
          LexAI Pro v1.0 <br/> Derecho Chileno
        </div>
      )}
    </div>
  );
};

export default Sidebar;
