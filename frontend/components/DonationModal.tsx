import React, { useState } from 'react';
import { X, Coffee, CreditCard, Building, Mail, User, Hash, Heart, Scale, Copy, Check } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [copiedRut, setCopiedRut] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'rut' | 'account') => {
    navigator.clipboard.writeText(text);
    if (type === 'rut') {
      setCopiedRut(true);
      setTimeout(() => setCopiedRut(false), 2000);
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#003366] p-5 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
            <Coffee size={100} />
          </div>
          <div className="flex items-center gap-3 font-bold text-lg relative z-10">
            <div className="bg-white/20 p-2 rounded-full">
              <Coffee size={20} className="text-amber-300" />
            </div>
            <span>Apoya a LexAI Pro</span>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors relative z-10">
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-6">
          
          <div className="text-center space-y-3">
            <h2 className="text-xl font-bold text-[#003366] flex items-center justify-center gap-2">
              ¡Gracias por valorar LexAI Pro! <Scale size={22} className="text-blue-500"/>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Este proyecto nace con el objetivo de democratizar el acceso al conocimiento jurídico chileno mediante inteligencia artificial de vanguardia. Si esta herramienta te ha sido útil para tus estudios o gestión legal, tu aporte es fundamental para mantener los servidores y seguir mejorando el sistema.
            </p>
            <div className="bg-blue-50 text-blue-800 text-sm font-medium py-2.5 px-4 rounded-lg inline-block border border-blue-100 shadow-sm">
              Sugerencia de donación: Agradecemos aportes voluntarios desde $5.000 CLP.
            </div>
          </div>
          
          {/* Bank Details */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 shadow-inner">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-200 pb-2">
              Datos para Transferencia
            </h3>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2"><User size={16} className="text-[#003366]"/> Nombre:</span>
                <span className="font-semibold text-slate-800">Javier Henríquez</span>
              </div>
              
              <div className="flex items-center justify-between group">
                <span className="text-slate-500 flex items-center gap-2"><CreditCard size={16} className="text-[#003366]"/> RUT:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">18.068.775-0</span>
                  <button onClick={() => handleCopy('180687750', 'rut')} className="text-slate-400 hover:text-[#003366] transition-colors" title="Copiar RUT">
                    {copiedRut ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2"><Building size={16} className="text-[#003366]"/> Banco:</span>
                <span className="font-semibold text-slate-800">Banco de Chile</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2"><CreditCard size={16} className="text-[#003366]"/> Tipo de Cuenta:</span>
                <span className="font-semibold text-slate-800">Cuenta Vista</span>
              </div>
              
              <div className="flex items-center justify-between group">
                <span className="text-slate-500 flex items-center gap-2"><Hash size={16} className="text-[#003366]"/> Número de Cuenta:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">00-009-22252-39</span>
                  <button onClick={() => handleCopy('000092225239', 'account')} className="text-slate-400 hover:text-[#003366] transition-colors" title="Copiar Cuenta">
                    {copiedAccount ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2"><Mail size={16} className="text-[#003366]"/> Correo:</span>
                <span className="font-semibold text-slate-800">ja.henriquezaraneda@gmail.com</span>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm font-medium text-[#003366] flex items-center justify-center gap-2 bg-blue-50/50 py-2 rounded-lg">
            <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
            Tu apoyo permite que sigamos innovando en el Derecho.
          </p>
          
          <button 
            onClick={onClose}
            className="w-full py-3 bg-[#003366] hover:bg-[#002244] text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
