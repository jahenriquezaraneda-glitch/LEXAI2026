import React, { useState } from 'react';

const DonationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 right-0 bg-gradient-to-l from-[#121212] to-[#2C2C2C] text-[#D4AF37] px-6 py-4 rounded-l-md shadow-[ -5px_0_15px_rgba(0,0,0,0.5)] border-l-2 border-y border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all z-[9999] group flex items-center gap-4"
      >
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-[3px] text-gray-400">APOYAR</p>
          <p className="font-titulo text-xs uppercase font-bold">LexAI Pro</p>
        </div>
        {/* Martillo en Oro SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-[#D4AF37] group-hover:scale-110 transition-transform">
          <path d="M11.64 4.53l3.53 3.54-1.41 1.41-3.53-3.53 1.41-1.42m5.66 0l1.41 1.42-7.07 7.07-1.41-1.41 7.07-7.08M5.98 13.02l4.24 4.24-2.83 2.83c-.39.39-1.02.39-1.41 0L2.45 16.55c-.39-.39-.39-1.02 0-1.41l3.53-3.53v1.41z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[10000] p-4">
          <div className="bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-none shadow-[0_0_50px_rgba(212,175,55,0.1)] max-w-sm w-full p-8 relative overflow-hidden">
            {/* Adorno de esquina dorada */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37]/40 translate-x-4 -translate-y-4"></div>
             
            <h2 className="font-titulo text-xl text-[#D4AF37] text-center mb-6 tracking-widest">TRANSFERENCIA ELECTRÓNICA</h2>
             
            <div className="space-y-4 text-sm font-light text-gray-300">
              <div className="flex justify-between border-b border-white/10 pb-2"><span>Beneficiario</span> <span className="text-white">Javier Henríquez</span></div>
              <div className="flex justify-between border-b border-white/10 pb-2"><span>RUT</span> <span className="text-white">18.068.775-0</span></div>
              <div className="flex justify-between border-b border-white/10 pb-2"><span>Institución</span> <span className="text-white">Banco de Chile</span></div>
              <div className="flex justify-between border-b border-white/10 pb-2"><span>N° Cuenta</span> <span className="text-white font-bold tracking-widest">00-009-22252-39</span></div>
              <p className="text-[10px] text-center text-[#D4AF37] mt-4 opacity-70">ja.henriquezaraneda@gmail.com</p>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="w-full mt-8 border border-[#D4AF37] text-[#D4AF37] py-3 text-xs tracking-[4px] uppercase hover:bg-[#D4AF37] hover:text-black transition-all duration-500 font-bold"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationButton;
