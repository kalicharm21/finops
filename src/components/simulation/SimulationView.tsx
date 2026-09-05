import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  ShoppingBag, 
  AlertOctagon, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  Bot,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const SimulationView: React.FC = () => {
  const { 
    simulateCustomerOrder, 
    simulateFailure, 
    runAgentCycle, 
    resetDemoData, 
    setActiveTab,
    isProcessingCycle,
    activeMission
  } = useApp();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleOrder = async (type: 'coffee' | 'sandwich' | 'combo' | 'family') => {
    setLoadingAction(type);
    setFeedback(null);
    try {
      const txn = await simulateCustomerOrder(type);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      setFeedback(`Successfully simulated ${txn.action} (₹${txn.amount})! Captured via Razorpay Test Mode.`);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRunAgent = async () => {
    setLoadingAction('agent_cycle');
    setFeedback(null);
    try {
      const decision = await runAgentCycle();
      if (decision) {
        setFeedback(`Agent formulated decision: "${decision.intent}". Outcome: ${decision.decisionStatus}.`);
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFailureSim = async (scenario: 'budget_limit' | 'low_roi' | 'unrecognized_vendor' | 'agent_paused') => {
    setLoadingAction(scenario);
    setFeedback(null);
    try {
      const dec = await simulateFailure(scenario);
      setFeedback(`Triggered guardrail test '${scenario}'. Result: ${dec.decisionStatus} - ${dec.policyEvaluation.reason}`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1b22] tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#5440e1]" />
            <span>Interactive Simulator & Live Sandbox</span>
          </h1>
          <p className="text-xs text-[#787587] mt-0.5">
            Trigger real-time payment events, AI hypothesis runs, and policy guardrail stress tests.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setActiveTab('ledger')}
            className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 text-xs shrink-0"
          >
            Inspect Ledger
          </button>
        </div>
      )}

      {/* 3 Interactive Testing Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Customer Order Stream */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6E8EF] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[#E6E8EF]">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1b22]">1. Simulate Customer Purchases</h3>
                <p className="text-[11px] text-[#787587]">Dispatches Razorpay test capture</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <button
                disabled={loadingAction !== null}
                onClick={() => handleOrder('coffee')}
                className="w-full p-3 bg-[#F7F8FC] hover:bg-[#F0EEFF] text-[#1a1b22] rounded-xl border border-[#E6E8EF] text-xs font-semibold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>☕</span>
                  <span>Artisan Pour-over Coffee</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">₹180</span>
              </button>

              <button
                disabled={loadingAction !== null}
                onClick={() => handleOrder('sandwich')}
                className="w-full p-3 bg-[#F7F8FC] hover:bg-[#F0EEFF] text-[#1a1b22] rounded-xl border border-[#E6E8EF] text-xs font-semibold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>🥪</span>
                  <span>Gourmet Panini Sandwich</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">₹250</span>
              </button>

              <button
                disabled={loadingAction !== null}
                onClick={() => handleOrder('combo')}
                className="w-full p-3 bg-[#F0EEFF] hover:bg-[#5440e1] text-[#5440e1] hover:text-white rounded-xl border border-[#5440e1]/30 text-xs font-bold flex items-center justify-between transition-all shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span>✨</span>
                  <span>Lunch Combo (AI Optimized)</span>
                </div>
                <span className="font-mono font-bold">₹399</span>
              </button>

              <button
                disabled={loadingAction !== null}
                onClick={() => handleOrder('family')}
                className="w-full p-3 bg-[#F7F8FC] hover:bg-[#F0EEFF] text-[#1a1b22] rounded-xl border border-[#E6E8EF] text-xs font-semibold flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <span>🍽️</span>
                  <span>Weekend Family Meal</span>
                </div>
                <span className="font-mono font-bold text-emerald-600">₹599</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-[#787587] pt-3 border-t border-[#E6E8EF]">
            Each click updates live mission revenue and logs full transaction steps in the ledger.
          </div>
        </div>

        {/* Pillar 2: Autonomous Agent Cycle */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6E8EF] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[#E6E8EF]">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#5440e1] flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1b22]">2. Autonomous Agent Execution</h3>
                <p className="text-[11px] text-[#787587]">Runs intent formulation & policy checks</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF] text-xs text-[#474555]">
                Trigger the agent to analyze the current basket size, attach rate trends, and formulate an actionable revenue hypothesis.
              </div>

              <button
                disabled={loadingAction !== null || isProcessingCycle}
                onClick={handleRunAgent}
                className="w-full py-3.5 bg-[#5440e1] hover:bg-[#5B4BE7] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-[#5440e1]/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className={`w-4 h-4 ${isProcessingCycle ? 'animate-spin' : ''}`} />
                <span>{isProcessingCycle ? 'Agent Synthesizing...' : 'Trigger Live Agent Cycle'}</span>
              </button>

              <button
                onClick={() => setActiveTab('agent')}
                className="w-full py-2.5 bg-[#F0EEFF] text-[#5440e1] hover:bg-[#5440e1] hover:text-white rounded-xl text-xs font-bold transition-all text-center"
              >
                Open Mission Control View
              </button>
            </div>
          </div>

          <div className="text-[11px] text-[#787587] pt-3 border-t border-[#E6E8EF]">
            Evaluates against 14 active guardrails before initiating any campaign.
          </div>
        </div>

        {/* Pillar 3: Policy Guardrail Stress Tests */}
        <div className="bg-white rounded-2xl p-5 border border-[#E6E8EF] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[#E6E8EF]">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1b22]">3. Guardrail Stress Tests</h3>
                <p className="text-[11px] text-[#787587]">Simulate policy violations & blocks</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <button
                disabled={loadingAction !== null}
                onClick={() => handleFailureSim('budget_limit')}
                className="w-full p-2.5 bg-red-50/50 hover:bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs font-semibold flex items-center justify-between transition-colors text-left"
              >
                <div>
                  <div className="font-bold">Test Single Txn Limit</div>
                  <div className="text-[10px] text-red-700/80">Proposes ₹2,200 spend (Limit: ₹1,500)</div>
                </div>
                <span className="text-[10px] font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">Escalate</span>
              </button>

              <button
                disabled={loadingAction !== null}
                onClick={() => handleFailureSim('low_roi')}
                className="w-full p-2.5 bg-red-50/50 hover:bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs font-semibold flex items-center justify-between transition-colors text-left"
              >
                <div>
                  <div className="font-bold">Test Low ROI Rejection</div>
                  <div className="text-[10px] text-red-700/80">Ad with 0.4x ROI (Min: 2.0x)</div>
                </div>
                <span className="text-[10px] font-mono bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">Block</span>
              </button>

              <button
                disabled={loadingAction !== null}
                onClick={() => handleFailureSim('agent_paused')}
                className="w-full p-2.5 bg-amber-50/50 hover:bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs font-semibold flex items-center justify-between transition-colors text-left"
              >
                <div>
                  <div className="font-bold">Test Execution While Paused</div>
                  <div className="text-[10px] text-amber-700/80">Confirms hard block when agent paused</div>
                </div>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Lock</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-[#787587] pt-3 border-t border-[#E6E8EF]">
            Demonstrates deterministic safety boundaries and human approval queues.
          </div>
        </div>
      </div>
    </div>
  );
};
