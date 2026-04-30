import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SetupScreen from './components/SetupScreen';
import DonationButton from './components/DonationButton';
import LexConsultorChat from './components/LexConsultorChat';
import { Message, SimulationState } from './types';
import { generateInitialCase, processTurn, getEvaluation } from './services/geminiService';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConsultorOpen, setIsConsultorOpen] = useState(false);
  
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSimulation = async (config: Partial<SimulationState>) => {
    setIsLoading(true);
    try {
      const initialResponse = await generateInitialCase(config);
      
      const newSimState: SimulationState = {
        matter: config.matter || '',
        role: config.role || '',
        complexity: config.complexity || '',
        mode: config.mode || '',
        history: [],
        currentRound: 1,
        library: [],
        caseDescription: initialResponse.caseDescription || ''
      };
      
      setSimState(newSimState);
      
      const aiMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        content: initialResponse,
        timestamp: new Date(),
        type: 'chat'
      };
      
      setMessages([aiMsg]);
    } catch (error) {
      console.error("Error starting simulation:", error);
      alert("Error al iniciar la simulación. Verifique su conexión y la API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!simState) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      type: 'chat'
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const response = await processTurn(simState, text);
      
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
        timestamp: new Date(),
        type: 'chat'
      };
      
      setMessages((prev) => [...prev, newAiMsg]);

      // Update Simulation State using the newRound returned by processTurn
      const nextRound = response.newRound ?? (simState.currentRound + 1);
      
      const updatedSimState: SimulationState = {
        ...simState,
        history: [...simState.history, { userArgument: text, aiResponse: response }],
        currentRound: nextRound
      };
      
      setSimState(updatedSimState);

      // Check if simulation is finished (4 rounds) and we just transitioned past round 4
      if (updatedSimState.currentRound > 4 && simState.currentRound <= 4) {
        const evaluation = await getEvaluation(updatedSimState);
        const evalMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: 'system',
          content: evaluation,
          timestamp: new Date(),
          type: 'evaluation'
        };
        setMessages((prev) => [...prev, evalMsg]);
      }

    } catch (error) {
      console.error("Failed to process turn:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: {
          examinerAnalysis: "Error de sistema: No se pudo procesar la solicitud. Verifique la conexión o la disponibilidad del servicio.",
          coachAdvice: "Mantenga la calma, los incidentes técnicos ocurren. Intente reformular su solicitud en unos momentos.",
          criticalChallenge: "¿Qué recurso procedería ante una denegación injustificada de servicio por parte de un tribunal?",
          exampleDraft: "N/A",
          actionMenu: "---\nLexAI Pro Control:\n🔹 /reintentar",
          references: []
        },
        timestamp: new Date(),
        type: 'chat'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [simState]);

  const handleRestart = () => {
    if (window.confirm("¿Está seguro que desea reiniciar la simulación? Se perderá el progreso actual.")) {
      setSimState(null);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen lex-app-container overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        onOpenConsultor={() => setIsConsultorOpen(true)}
      />
      
      <LexConsultorChat 
        isOpen={isConsultorOpen} 
        onClose={() => setIsConsultorOpen(false)} 
      />

      <main 
        className={`flex-1 flex flex-col transition-all duration-300 h-full relative ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        {!simState ? (
          <SetupScreen onStart={handleStartSimulation} isLoading={isLoading} />
        ) : (
          <ChatArea 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
            simState={simState}
            onRestart={handleRestart}
          />
        )}
        
        <DonationButton />
      </main>
    </div>
  );
};

export default App;
