export interface LexAIResponse {
  examinerAnalysis: string;
  coachAdvice: string;
  criticalChallenge: string;
  exampleDraft: string;
  actionMenu: string;
  references: string[];
  caseDescription?: string;
  newRound?: number;
}

export interface TurnData {
  userArgument: string;
  aiResponse: LexAIResponse;
}

export interface SimulationState {
  matter: string;
  role: string;
  complexity: string;
  mode: string;
  history: TurnData[];
  currentRound: number;
  library: any[];
  caseDescription: string;
}

export interface EvaluationResult {
  jurisprudencia: number;
  doctrina: number;
  pensamientoCritico: number;
  redaccion: number;
  planEstudio: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string | LexAIResponse | EvaluationResult;
  timestamp: Date;
  type?: 'chat' | 'evaluation';
}

export type CommandType = '/redactar' | '/analizar' | '/doctrina' | '/coach';
