import React from 'react';

const LegalDisclaimer: React.FC = () => {
  return (
    <div className="p-4 bg-[#121212] border border-[#D4AF37]/20 rounded-md my-4">
      <h4 className="font-titulo text-[#D4AF37] text-[10px] tracking-[2px] mb-2">⚖️ AVISO DE EXENCIÓN LEGAL</h4>
      <p className="text-[9px] text-gray-500 leading-relaxed font-serif text-justify italic">
        LexAI Pro es una herramienta de asistencia basada en inteligencia artificial destinada exclusivamente a fines académicos, de simulación y apoyo a la investigación jurídica. 
        <span className="text-[#D4AF37]/80"> El desarrollador y la plataforma no prestan servicios de asesoría legal ni sustituyen el juicio técnico de un abogado habilitado.</span> 
        El uso de la información generada es responsabilidad exclusiva del usuario. LexAI Pro no se responsabiliza por decisiones judiciales, pérdidas o perjuicios derivados de la interpretación de sus contenidos.
      </p>
    </div>
  );
};

export default LegalDisclaimer;
