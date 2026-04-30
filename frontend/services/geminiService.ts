import { GoogleGenAI, Type } from '@google/genai';
import { SimulationState, EvaluationResult, LexAIResponse } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

const lexAIResponseSchema = {
  type: Type.OBJECT,
  properties: {
    examinerAnalysis: { type: Type.STRING },
    coachAdvice: { type: Type.STRING },
    criticalChallenge: { type: Type.STRING },
    exampleDraft: { type: Type.STRING },
    actionMenu: { type: Type.STRING },
    references: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    caseDescription: { 
      type: Type.STRING,
      description: "Descripción del caso en 2 párrafos técnicos. Solo requerido en la generación inicial."
    }
  },
  required: [
    "examinerAnalysis",
    "coachAdvice",
    "criticalChallenge",
    "exampleDraft",
    "actionMenu",
    "references",
  ],
};

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    jurisprudencia: { type: Type.NUMBER, description: "Puntuación de 1 a 4" },
    doctrina: { type: Type.NUMBER, description: "Puntuación de 1 a 4" },
    pensamientoCritico: { type: Type.NUMBER, description: "Puntuación de 1 a 4" },
    redaccion: { type: Type.NUMBER, description: "Puntuación de 1 a 4" },
    planEstudio: { type: Type.STRING, description: "Plan de estudio personalizado basado en el desempeño" }
  },
  required: ["jurisprudencia", "doctrina", "pensamientoCritico", "redaccion", "planEstudio"]
};

const CONFLICTS_BY_MATTER: Record<string, string[]> = {
  'Civil': ['Incumplimiento Contractual', 'Responsabilidad Extracontractual', 'Precario', 'Reivindicatorio', 'Partición', 'Servidumbres', 'Ley de Copropiedad'],
  'Penal': ['Estafa', 'VIF', 'Delitos Económicos', 'Ley de Drogas', 'Cuasidelitos', 'Delitos Informáticos'],
  'Laboral': ['Despido Indirecto', 'Tutela de Derechos Fundamentales', 'Accidente del Trabajo', 'Cobro de Prestaciones', 'Subcontratación'],
  'Familia': ['Alimentos', 'Cuidado Personal', 'Relación Directa y Regular', 'Divorcio Culposo', 'Medidas de Protección', 'Adopción'],
  'Administrativo': ['Reclamo de Ilegalidad', 'Sumario Administrativo', 'Responsabilidad del Estado', 'Invalidación de Acto', 'Recurso de Protección'],
  'Comercial': ['Cobro de Pagaré', 'Liquidación Forzosa', 'Competencia Desleal', 'Incumplimiento Societario', 'Marcas y Patentes']
};

const PLOT_TWISTS = [
  'Falta de personería o representación legal insuficiente', 
  'Prescripción de la acción', 
  'Incompetencia absoluta del tribunal', 
  'Notificación defectuosa o viciada', 
  'Abandono del procedimiento', 
  'Caducidad del plazo para accionar',
  'Falta de legitimación activa'
];

export const generateInitialCase = async (state: Partial<SimulationState>, library: any[] = []): Promise<LexAIResponse> => {
  const { matter = 'Civil (C-PRO)', role, complexity, mode } = state;
  const libraryContext = library.length > 0 ? `BIBLIOTECA TÉCNICA:\n${JSON.stringify(library)}` : 'Biblioteca vacía.';

  // Determine base matter for conflict selection
  const baseMatterKey = Object.keys(CONFLICTS_BY_MATTER).find(k => matter.includes(k)) || 'Civil';
  const specificConflicts = CONFLICTS_BY_MATTER[baseMatterKey];
  const specificConflict = specificConflicts[Math.floor(Math.random() * specificConflicts.length)];
  const plotTwist = PLOT_TWISTS[Math.floor(Math.random() * PLOT_TWISTS.length)];

  const prompt = `${libraryContext}

  GENERA UN CASO JUDICIAL CHILENO TOTALMENTE ÚNICO aplicando el PROTOCOLO ANTIRREDUNDANCIA.
  - Materia General: ${matter}
  - Conflicto Específico: ${specificConflict}
  - Cuantía / Gravedad: ${complexity} (Nivel de dificultad: RANDOM entre 1 y 10)
  - Rol del Usuario: ${role}
  - Modo de simulación: ${mode}
  - Giro de Trama (Vicio Procesal OBLIGATORIO a incluir): ${plotTwist}
  
  Prohibido repetir casos comunes como la "Promesa de Compraventa" o "Despido Injustificado común". 
  Busca nichos específicos (ej: Servidumbres, Recurso de Protección por Alzas de Isapre, Ley de Copropiedad, Delitos Informáticos, etc.).

  Describe el caso en 2 párrafos técnicos en el campo 'caseDescription', integrando orgánicamente el conflicto y el giro de trama. 
  Luego, como EXAMINADOR, presenta el primer análisis adversarial/técnico adaptado estrictamente al modo "${mode}" (ver instrucciones del sistema para el tono y exigencia).
  Como COACH, da un consejo inicial sobre cómo abordar el vicio procesal.
  Incluye el DESAFIO CRITICO y un breve EJEMPLO DE ESCRITO (exampleDraft) para el usuario.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: lexAIResponseSchema,
      temperature: 0.7 // Higher temperature for better creative integration and randomness
    }
  });

  const parsed = JSON.parse(response.text || '{}') as LexAIResponse;
  return {
    ...parsed,
    caseDescription: parsed.caseDescription || "Caso generado por LexAI Pro. Proceda con su análisis."
  };
};

export const processTurn = async (state: SimulationState, userArgument: string): Promise<LexAIResponse> => {
  const isCommand = userArgument.trim().startsWith("/");
  const currentRound = isCommand ? state.currentRound : state.currentRound + 1;

  const historyText = state.history.map(h => `Usuario: ${h.userArgument}\nLexAI: ${h.aiResponse.examinerAnalysis}`).join('\n');
  const libraryContext = (state.library && state.library.length > 0) 
    ? `BIBLIOTECA TÉCNICA (Prioridad Absoluta):\n${JSON.stringify(state.library)}` 
    : 'Biblioteca vacía.';
  
  let taskInstruction = "";
  const cmd = userArgument.toLowerCase();
  
  if (cmd.startsWith("/redactar") || cmd.includes("redactar")) {
     const typeMatch = cmd.match(/\/redactar\s+\[?(\w+)\]?/);
     const type = typeMatch ? typeMatch[1] : state.matter;
     taskInstruction = `[MÓDULO: REDACTAR ACTIVADO] -> TAREA: Redactar escrito profesional para la materia ${type}. Use bloques de código y estructura: Suma, Designa, Cuerpo, Petitorio, Otrosíes.`;
  } else if (cmd.includes("/analizar") || cmd.includes("analizar") || cmd.includes("analyze")) {
     taskInstruction = "[MÓDULO: ANALIZAR ACTIVADO] -> TAREA: Evaluación exhaustiva siguiendo la estructura: Hechos -> Derecho Aplicable -> Análisis Crítico -> Recomendación Estratégica.";
  } else if (cmd.includes("/doctrina") || cmd.includes("doctrina") || cmd.includes("doctrine")) {
     taskInstruction = "[MÓDULO: DOCTRINA ACTIVADO] -> TAREA: Citar autores chilenos (Peñailillo, Somarriva, etc.) según la materia y su aplicación.";
  } else if (cmd.includes("/coach")) {
     taskInstruction = "[MÓDULO: COACH ACTIVADO] -> TAREA: Brindar consejos de oratoria para audiencias y tácticas de litigación.";
  }

  const prompt = `---
${libraryContext}
---
CASO: ${state.caseDescription}
MATERIA: ${state.matter}
ROL USUARIO: ${state.role}
COMPLEJIDAD: ${state.complexity}
MODO: ${state.mode} (ADOPTA ESTRICTAMENTE EL TONO Y EXIGENCIA DE ESTE MODO)
RONDA: ${currentRound} de 4.

HISTORIAL PREVIO:
${historyText}

NUEVO MENSAJE (ARGUMENTO O COMANDO):
${userArgument}

${taskInstruction}

RECUERDA:
1. Precisión Técnica Chilena (Fojas, Autos, Traslado, etc.).
2. Para /REDACTAR, use bloques de código ( \`\`\` ).
3. Ofrezca siempre el 'actionMenu' al final.
4. Adapte su nivel de lenguaje a un nivel de complejidad ${state.complexity}.

Si comienza con "GUARDAR EN BIBLIOTECA:", detén el debate y procesa el guardado.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: lexAIResponseSchema,
      temperature: 0.4
    }
  });

  const parsedResponse = JSON.parse(response.text || '{}') as LexAIResponse;
  
  return {
    ...parsedResponse,
    newRound: currentRound
  };
};

export const getEvaluation = async (state: SimulationState): Promise<EvaluationResult> => {
  const historyText = state.history.map(h => `Usuario: ${h.userArgument}\nLexAI: ${h.aiResponse.examinerAnalysis}`).join('\n');
  
  const prompt = `Evalúa el desempeño del usuario basado en el siguiente debate jurídico:
  MATERIA: ${state.matter}
  ROL: ${state.role}
  MODO: ${state.mode}
  DEBATE:
  ${historyText}
  
  Devuelve una evaluación técnica basada en la rúbrica 1-4 para:
  1. Jurisprudencia
  2. Doctrina
  3. Pensamiento Crítico
  4. Redacción/Técnica
  
  Y un plan de estudio personalizado.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: evaluationSchema,
      temperature: 0.2
    }
  });

  return JSON.parse(response.text || '{}') as EvaluationResult;
};

export const resetSimulation = (materiaActual: string): Partial<SimulationState> => {
  return {
    currentRound: 1,
    history: [],
    matter: materiaActual,
  };
};
