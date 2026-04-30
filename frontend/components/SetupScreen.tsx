import React, { useState } from 'react';
import { Gavel, Settings2, Shuffle } from 'lucide-react';
import { SimulationState } from '../types';
import LegalDisclaimer from './LegalDisclaimer';

interface SetupScreenProps {
  onStart: (config: Partial<SimulationState>) => void;
  isLoading: boolean;
}

const MATTERS = ['Civil (C-PRO)', 'Penal (P-PRO)', 'Laboral (L-PRO)', 'Familia (F-PRO)', 'Administrativo (A-PRO)', 'Comercial'];
const ROLES = ['Abogado Demandante', 'Defensa', 'Querellante', 'Juez'];
const COMPLEXITIES = ['Mínima (Policía Local / Juzgado de Paz)', 'Media (Juzgado de Letras / Garantía)', 'Máxima (Cortes de Apelaciones / Suprema)'];
const MODES = ['Académico (Examen de Grado)', 'Litigación (Audiencia)', 'Asesoría (Colega Senior)'];

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [matter, setMatter] = useState('Aleatorio');
  const [role, setRole] = useState('Aleatorio');
  const [complexity, setComplexity] = useState('Aleatorio');
  const [mode, setMode] = useState('Aleatorio');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalMatter = matter === 'Aleatorio' ? getRandom(MATTERS) : matter;
    const finalRole = role === 'Aleatorio' ? getRandom(ROLES) : role;
    const finalComplexity = complexity === 'Aleatorio' ? getRandom(COMPLEXITIES) : complexity;
    const finalMode = mode === 'Aleatorio' ? getRandom(MODES) : mode;

    onStart({ 
      matter: finalMatter, 
      role: finalRole, 
      complexity: finalComplexity, 
      mode: finalMode 
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-transparent overflow-y-auto">
      <div className="bg-[#1A1A1A]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#D4AF37]/30 w-full max-w-2xl overflow-hidden my-auto">
        <div className="bg-[#121212] p-6 text-[#E5E5E5] text-center relative border-b border-[#D4AF37]/20">
          <div className="absolute top-6 right-6 opacity-20 text-[#D4AF37]">
            <Shuffle size={48} />
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-[#2C2C2C] p-3 rounded-full border border-[#D4AF37]/30">
              <Gavel size={32} className="text-[#D4AF37]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-titulo text-[#D4AF37]">LexAI Pro</h1>
          <p className="text-[#A3A3A3] mt-2 italic">Configuración de Sala de Litigación Virtual</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#D4AF37] flex items-center gap-2 font-titulo">
                <Settings2 size={16} />
                Materia
              </label>
              <select 
                value={matter}
                onChange={(e) => setMatter(e.target.value)}
                className="w-full p-3 bg-[#2C2C2C] text-[#E5E5E5] border border-[#4A4A4A] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
              >
                <option value="Aleatorio">🎲 Aleatorio (Recomendado)</option>
                {MATTERS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#D4AF37] flex items-center gap-2 font-titulo">
                <Settings2 size={16} />
                Rol del Usuario
              </label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-[#2C2C2C] text-[#E5E5E5] border border-[#4A4A4A] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
              >
                <option value="Aleatorio">🎲 Aleatorio</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#D4AF37] flex items-center gap-2 font-titulo">
                <Settings2 size={16} />
                Cuantía / Gravedad
              </label>
              <select 
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className="w-full p-3 bg-[#2C2C2C] text-[#E5E5E5] border border-[#4A4A4A] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
              >
                <option value="Aleatorio">🎲 Aleatorio</option>
                {COMPLEXITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#D4AF37] flex items-center gap-2 font-titulo">
                <Settings2 size={16} />
                Modo de Simulación
              </label>
              <select 
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-3 bg-[#2C2C2C] text-[#E5E5E5] border border-[#4A4A4A] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
              >
                <option value="Aleatorio">🎲 Aleatorio</option>
                {MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

          </div>

          <LegalDisclaimer />

          <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-[#2C2C2C]">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full group relative px-12 py-5 bg-[#121212] border border-[#D4AF37]/50 overflow-hidden transition-all hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-70 disabled:cursor-not-allowed rounded-md"
            >
              {/* Efecto de brillo sutil al pasar el mouse */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
               
              <div className="relative flex flex-col items-center">
                <span className="font-titulo text-[#D4AF37] text-sm tracking-[5px] font-bold uppercase mb-1">
                  {isLoading ? <span className="animate-pulse">GENERANDO EXPEDIENTE...</span> : 'INICIAR LITIGACIÓN'}
                </span>
                <span className="text-[9px] text-gray-500 uppercase tracking-[2px] font-serif italic">
                  {isLoading ? 'Analizando variables...' : 'Apertura de Expediente Judicial'}
                </span>
              </div>
            </button>

            {/* Disclaimer de Responsabilidad (Texto pequeño debajo del botón) */}
            <p className="max-w-md text-center text-[8px] text-gray-600 font-serif leading-tight">
              Al iniciar, usted reconoce que LexAI Pro es una herramienta de simulación académica. 
              El desarrollador no se hace responsable por el uso de esta información fuera del entorno de práctica.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;
