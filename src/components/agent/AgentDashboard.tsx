import React, { useState } from 'react';
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Scale, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause, 
  Sparkles, 
  Layers, 
  Clock, 
  Check, 
  X, 
  Sliders, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Zap,
  Info,
  Send,
  Cpu,
  MessageSquare
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { AgentDecision } from '../../types';
import { AgentService } from '../../lib/ai/agentService';

export const AgentDashboard: React.FC = () => {
  const { 
    agent, 
    activeMission, 
    decisions, 
    transactions, 
    campaigns, 
    policies, 
    runAgentCycle, 
    isProcessingCycle, 
    setAgentAutonomy,
    approveDecision,
    rejectDecision,
    setActiveTab,
    simulateCustomerOrder
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'decision' | 'chart' | 'memory'>('decision');
  const [modifyingDecision, setModifyingDecision] = useState<AgentDecision | null>(null);
  const [modifiedAmount, setModifiedAmount] = useState<number>(700);

  // Copilot state
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotHistory, setCopilotHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string; model?: string }>>([
    {
      role: 'assistant',
      text: `Hello! I'm your FinOps AI Co-Pilot powered by Groq's LPU™ inference engine (llama-3.3-70b-versatile). Ask me anything about cash flow optimization, basket attach rates, or policy constraints.`,
      model: 'llama-3.3-70b-versatile'
    }
  ]);

  const handleSendCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || copilotLoading) return;
    const q = copilotQuery;
    setCopilotQuery('');
    setCopilotHistory(prev => [...prev, { role: 'user', text: q }]);
    setCopilotLoading(true);
    try {
      const res = await AgentService.askCopilot(q, {
        mission: activeMission,
        agentStatus: agent.status,
        autonomy: agent.autonomyLevel,
        policiesCount: policies.filter(p => p.enabled).length
      });
      setCopilotHistory(prev => [...prev, { role: 'assistant', text: res.reply, model: res.model }]);
    } catch {
      setCopilotHistory(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: 'FinOps Co-Pilot ready. Operating within policy guardrails. Budget remaining: ₹' + (activeMission.budget - activeMission.spent).toLocaleString(), 
          model: 'llama-3.3-70b-versatile' 
        }
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  // Latest proposed or executed decision
  const latestDecision = decisions[0] || {
    id: 'dec_sample',
    missionId: activeMission.id,
    timestamp: new Date().toISOString(),
    intent: 'Promote ₹399 combo meal to lunch crowd to boost mid-day basket size',
    observation: 'Lunch basket size average is currently ₹210 with 14% sandwich attachment. Friday lunch traffic shows a 28% increase in order volume.',
    hypothesis: 'Launching a targeted ₹399 Coffee + Sandwich bundle campaign with an incentive coupon will lift AOV to ₹390 and convert ~120 lunch customers.',
    proposedAction: {
      type: 'CREATE_CAMPAIGN',
      title: 'Launch ₹399 Coffee + Sandwich campaign',
      amount: 700,
      channel: 'WhatsApp + Payment Links',
      details: {
        bundlePrice: 399,
        items: ['Artisan Coffee', 'Gourmet Panini Sandwich']
      }
    },
    expectedRevenue: 4800,
    expectedCost: 700,
    expectedROI: 5.8,
    confidence: 0.91,
    riskLevel: 'LOW',
    evidence: [
      'Historical Friday lunch order volume +28%',
      'Sandwich standalone attach rate 14% vs 42% benchmark',
      'Average order value increase projection +₹180/order',
      'Customer appetite survey index: 88/100'
    ],
    policyEvaluation: {
      allowed: true,
      requiresApproval: false,
      reason: 'All active policy checks passed.',
      checks: [
        { policyId: '1', policyName: 'Max Daily Spend', passed: true, message: 'Within remaining daily budget allowance.' },
        { policyId: '2', policyName: 'Max Single Txn', passed: true, message: 'Proposed ₹700 <= ₹1,500 limit.' },
        { policyId: '3', policyName: 'Min ROI Threshold', passed: true, message: 'Expected ROI 5.8x >= 2.0x target.' },
        { policyId: '4', policyName: 'Stop Loss Guardrail', passed: true, message: 'No negative stop loss breach detected.' }
      ]
    },
    decisionStatus: 'PROPOSED',
    executionStatus: 'NOT_STARTED'
  };

  // Trajectory chart mock data
  const revenueChartData = [
    { day: 'Oct 01', actual: 9680, baseline: 9680, target: 10000 },
    { day: 'Oct 05', actual: 10240, baseline: 9800, target: 11500 },
    { day: 'Oct 10', actual: 11100, baseline: 9900, target: 13500 },
    { day: 'Oct 15', actual: 11850, baseline: 10100, target: 15500 },
    { day: 'Oct 20', actual: 12600, baseline: 10200, target: 17500 },
    { day: 'Oct 24', actual: 13420, baseline: 10300, target: 20000 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Agent Control Strip */}
      <div className="bg-white rounded-2xl p-5 border border-[#E6E8EF] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F0EEFF] text-[#5440e1] flex items-center justify-center border border-[#5440e1]/20 shadow-xs shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1a1b22] tracking-tight">{agent.name}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                agent.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {agent.status}
              </span>
            </div>
            <div className="text-xs text-[#787587] flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Last cycle: 2m ago
              </span>
              <span>•</span>
              <span className="font-mono text-[#1a1b22] font-semibold">{agent.throughputEventsPerMin.toLocaleString()} events/min</span>
              <span>•</span>
              <span>Active Tasks: <strong className="text-[#1a1b22]">{agent.activeTasksCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Autonomy Dial & Trigger Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Autonomy slider */}
          <div className="bg-[#F7F8FC] px-4 py-2 rounded-xl border border-[#E6E8EF] flex items-center gap-3">
            <div className="text-left">
              <div className="text-[11px] font-semibold text-[#787587] uppercase tracking-wider">Autonomy Clearance</div>
              <div className="text-xs font-bold text-[#1a1b22] flex items-center gap-1 font-mono">
                <span>{agent.autonomyLevel}%</span>
                <span className="text-[10px] text-[#5440e1] font-normal">(Auto &lt; ₹1,500)</span>
              </div>
            </div>
            <input
              id="agent-autonomy-slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={agent.autonomyLevel}
              onChange={(e) => setAgentAutonomy(parseInt(e.target.value))}
              className="w-24 accent-[#5440e1] cursor-pointer"
            />
          </div>

          {/* Trigger Cycle Button */}
          <button
            id="agent-run-cycle-btn"
            disabled={isProcessingCycle || agent.status !== 'ONLINE'}
            onClick={() => runAgentCycle()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5440e1] hover:bg-[#5B4BE7] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-[#5440e1]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className={`w-4 h-4 ${isProcessingCycle ? 'animate-spin' : ''}`} />
            <span>{isProcessingCycle ? 'Synthesizing...' : 'Evaluate Live Opportunity'}</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Revenue Generated */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E8EF] shadow-xs hover:border-[#5440e1]/30 transition-all">
          <div className="flex items-center justify-between text-xs text-[#787587] mb-2 font-medium">
            <span>Revenue Generated</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1a1b22] font-financial-data tracking-tight">
            ₹{activeMission.currentRevenue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#787587]">Target: ₹{activeMission.targetRevenue.toLocaleString()}</span>
            <span className="text-emerald-600 font-semibold font-mono flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +38.6%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[#F4F5F9] rounded-full overflow-hidden mt-3">
            <div 
              className="h-full bg-[#5440e1] rounded-full" 
              style={{ width: `${Math.min(100, (activeMission.currentRevenue / activeMission.targetRevenue) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Capital Deployed */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E8EF] shadow-xs hover:border-[#5440e1]/30 transition-all">
          <div className="flex items-center justify-between text-xs text-[#787587] mb-2 font-medium">
            <span>Capital Deployed</span>
            <span className="p-1.5 bg-indigo-50 text-[#5440e1] rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1a1b22] font-financial-data tracking-tight">
            ₹{activeMission.spent.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#787587]">Cap: ₹{activeMission.budget.toLocaleString()}</span>
            <span className="text-[#5440e1] font-semibold font-mono">
              ₹{(activeMission.budget - activeMission.spent).toLocaleString()} left
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#F4F5F9] rounded-full overflow-hidden mt-3">
            <div 
              className="h-full bg-indigo-500 rounded-full" 
              style={{ width: `${Math.min(100, (activeMission.spent / activeMission.budget) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3: Current Net ROI */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E8EF] shadow-xs hover:border-[#5440e1]/30 transition-all">
          <div className="flex items-center justify-between text-xs text-[#787587] mb-2 font-medium">
            <span>Current Net ROI</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-financial-data tracking-tight font-mono">
            {activeMission.currentROI}x
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#787587]">Min Goal: {activeMission.minimumROI}x</span>
            <span className="text-emerald-600 font-semibold font-mono flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +170% target
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#F4F5F9] rounded-full overflow-hidden mt-3">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        {/* Metric 4: Policy Compliance */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E8EF] shadow-xs hover:border-[#5440e1]/30 transition-all">
          <div className="flex items-center justify-between text-xs text-[#787587] mb-2 font-medium">
            <span>Policy Compliance</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#1a1b22] font-financial-data tracking-tight font-mono">
            {agent.policyCompliance}%
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#787587]">14 Active Guardrails</span>
            <span className="text-purple-600 font-semibold font-mono">
              {agent.blockedActions} Blocked
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#F4F5F9] rounded-full overflow-hidden mt-3">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${agent.policyCompliance}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Latest AI Decision & Formulation (Left) + Revenue Trajectory & Insights (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Decision & Action Formulation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E8EF] shadow-xs overflow-hidden">
            {/* Decision Header */}
            <div className="p-5 border-b border-[#E6E8EF] flex items-center justify-between bg-gradient-to-r from-white to-[#F0EEFF]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#5440e1] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  AI
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#1a1b22]">Latest Opportunity Synthesis</h2>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5F3FF] text-[#5B21B6] border border-[#DDD6FE] rounded text-[10px] font-mono font-bold">
                      <Cpu className="w-3 h-3 text-[#7C3AED]" />
                      <span>Groq LPU™</span>
                      {latestDecision.groqMetadata?.latencyMs && (
                        <span className="text-[#6D28D9] font-normal">({latestDecision.groqMetadata.latencyMs}ms)</span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-[#787587]">Powered by Groq Cloud LPU Engine (llama-3.3-70b-versatile)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-indigo-50 text-[#5440e1] border border-indigo-200 rounded-md text-xs font-mono font-bold">
                  {Math.round(latestDecision.confidence * 100)}% Confidence
                </span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                  latestDecision.decisionStatus === 'APPROVED' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : latestDecision.decisionStatus === 'BLOCKED'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {latestDecision.decisionStatus}
                </span>
              </div>
            </div>

            {/* Decision Body */}
            <div className="p-5 space-y-5">
              {/* Intent */}
              <div>
                <div className="text-[11px] font-bold text-[#787587] uppercase tracking-wider mb-1">Intent & Strategy</div>
                <div className="text-sm font-semibold text-[#1a1b22] bg-[#F7F8FC] p-3 rounded-xl border border-[#E6E8EF]">
                  "{latestDecision.intent}"
                </div>
              </div>

              {/* Groq LPU Reasoning Trace */}
              {latestDecision.groqMetadata?.reasoningTrace && (
                <div className="p-3.5 bg-[#FAF5FF] rounded-xl border border-[#E9D5FF] text-xs">
                  <div className="text-[10px] font-bold text-[#6B21A8] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                    <Cpu className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Groq LPU™ Real-Time Reasoning Trace</span>
                  </div>
                  <p className="text-xs text-[#581C87] font-mono leading-relaxed">
                    {latestDecision.groqMetadata.reasoningTrace}
                  </p>
                </div>
              )}

              {/* Observation & Hypothesis Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
                  <div className="text-[11px] font-bold text-[#787587] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#5440e1]" />
                    <span>Live Observation</span>
                  </div>
                  <p className="text-xs text-[#474555] leading-relaxed">
                    {latestDecision.observation}
                  </p>
                </div>

                <div className="p-4 bg-[#F0EEFF]/50 rounded-xl border border-[#5440e1]/20">
                  <div className="text-[11px] font-bold text-[#5440e1] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#5440e1]" />
                    <span>AI Revenue Hypothesis</span>
                  </div>
                  <p className="text-xs text-[#1a1b22] leading-relaxed font-medium">
                    {latestDecision.hypothesis}
                  </p>
                </div>
              </div>

              {/* Proposed Action Banner */}
              <div className="p-4 bg-white rounded-xl border-2 border-[#5440e1]/20 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E8EF]">
                  <div>
                    <div className="text-xs font-bold text-[#1a1b22] flex items-center gap-2">
                      <span>{latestDecision.proposedAction.title}</span>
                      <span className="text-[10px] bg-[#F0EEFF] text-[#5440e1] px-2 py-0.5 rounded font-mono font-bold">
                        {latestDecision.proposedAction.channel || 'Payment Link'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#787587] mt-0.5">
                      Target Audience: {latestDecision.proposedAction.details?.targetUsers || 1400} High-Intent Lunch Visitors
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-[#787587]">Required Spend</div>
                    <div className="text-base font-bold text-[#5440e1] font-mono">
                      ₹{latestDecision.proposedAction.amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Financial Projections Strip */}
                <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                  <div className="p-2 bg-[#F7F8FC] rounded-lg">
                    <div className="text-[10px] text-[#787587]">Expected Revenue</div>
                    <div className="text-xs font-bold text-emerald-600 font-mono">₹{latestDecision.expectedRevenue.toLocaleString()}</div>
                  </div>
                  <div className="p-2 bg-[#F7F8FC] rounded-lg">
                    <div className="text-[10px] text-[#787587]">Expected Net ROI</div>
                    <div className="text-xs font-bold text-[#5440e1] font-mono">{latestDecision.expectedROI}x</div>
                  </div>
                  <div className="p-2 bg-[#F7F8FC] rounded-lg">
                    <div className="text-[10px] text-[#787587]">Risk Assessment</div>
                    <div className="text-xs font-bold text-emerald-600">{latestDecision.riskLevel} Risk</div>
                  </div>
                </div>
              </div>

              {/* Deterministic Policy Check Results */}
              <div>
                <div className="text-[11px] font-bold text-[#787587] uppercase tracking-wider mb-2">
                  Deterministic Policy Verification
                </div>
                <div className="space-y-1.5">
                  {latestDecision.policyEvaluation.checks.map((check, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2.5 rounded-lg flex items-start gap-2 text-xs border ${
                        check.passed 
                          ? 'bg-emerald-50/50 border-emerald-200/60 text-emerald-900' 
                          : check.requiresApproval
                          ? 'bg-amber-50/50 border-amber-200/60 text-amber-900'
                          : 'bg-red-50/50 border-red-200/60 text-red-900'
                      }`}
                    >
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : check.requiresApproval ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold flex items-center justify-between">
                          <span>{check.policyName}</span>
                          <span className="font-mono text-[10px]">{check.passed ? 'PASSED' : check.requiresApproval ? 'ESCALATED' : 'BLOCKED'}</span>
                        </div>
                        <div className="text-[11px] text-[#474555] mt-0.5">{check.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons for Decision */}
              {latestDecision.decisionStatus === 'PROPOSED' && (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    id="decision-approve-btn"
                    onClick={() => approveDecision(latestDecision.id, 'Approved via Mission Control')}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Execute Autonomously (₹{latestDecision.proposedAction.amount})</span>
                  </button>

                  <button
                    id="decision-reject-btn"
                    onClick={() => rejectDecision(latestDecision.id, 'Declined by operator in mission control')}
                    className="py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Groq FinOps Co-Pilot Interactive Terminal */}
          <div className="bg-white rounded-2xl border border-[#E6E8EF] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E6E8EF] flex items-center justify-between bg-gradient-to-r from-white to-[#F5F3FF]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1a1b22]">FinOps Co-Pilot</h3>
                    <span className="px-2 py-0.5 bg-[#EDE9FE] text-[#6D28D9] rounded text-[10px] font-mono font-bold">
                      Groq LPU • llama-3.3-70b
                    </span>
                  </div>
                  <p className="text-[11px] text-[#787587]">Live financial analysis, ROI projections & policy interrogation</p>
                </div>
              </div>

              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Groq Engine Ready"></span>
            </div>

            {/* Chat message stream */}
            <div className="p-4 max-h-64 overflow-y-auto space-y-3 text-xs bg-[#FBFBFE]">
              {copilotHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[90%] p-3 rounded-2xl leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#5440e1] text-white rounded-br-none'
                        : 'bg-white border border-[#E6E8EF] text-[#1a1b22] rounded-bl-none shadow-2xs whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.model && (
                    <span className="text-[9px] text-[#8C889B] font-mono mt-1 px-1">
                      {msg.model}
                    </span>
                  )}
                </div>
              ))}

              {copilotLoading && (
                <div className="flex items-center gap-2 p-3 bg-white border border-[#E6E8EF] rounded-2xl rounded-bl-none text-[#5440e1] font-mono text-xs shadow-2xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7C3AED]" />
                  <span>Groq LPU computing financial recommendation...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-[#F0EEFF] bg-white flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-[#8C889B] shrink-0 font-medium">Quick:</span>
              <button
                onClick={() => setCopilotQuery('How should I optimize the remaining ₹2,520 mission budget?')}
                className="px-2.5 py-1 bg-[#F7F8FC] hover:bg-[#F0EEFF] text-[#474555] hover:text-[#5440e1] rounded-lg shrink-0 border border-[#E6E8EF] transition-colors"
              >
                Optimize ₹2,520 budget
              </button>
              <button
                onClick={() => setCopilotQuery('Why did the ₹2,200 influencer spend trip the approval policy?')}
                className="px-2.5 py-1 bg-[#F7F8FC] hover:bg-[#F0EEFF] text-[#474555] hover:text-[#5440e1] rounded-lg shrink-0 border border-[#E6E8EF] transition-colors"
              >
                Explain ₹2,200 hold
              </button>
              <button
                onClick={() => setCopilotQuery('Suggest a high-margin weekend breakfast promotion')}
                className="px-2.5 py-1 bg-[#F7F8FC] hover:bg-[#F0EEFF] text-[#474555] hover:text-[#5440e1] rounded-lg shrink-0 border border-[#E6E8EF] transition-colors"
              >
                Weekend promotion
              </button>
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendCopilot} className="p-3 border-t border-[#E6E8EF] bg-white flex items-center gap-2">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="Ask Groq Co-Pilot about revenue, margins, or policy limits..."
                disabled={copilotLoading}
                className="flex-1 px-3 py-2 text-xs bg-[#F7F8FC] rounded-xl border border-[#E6E8EF] focus:border-[#7C3AED] focus:bg-white text-[#1a1b22] placeholder-[#8C889B] outline-none transition-all"
              />
              <button
                type="submit"
                disabled={copilotLoading || !copilotQuery.trim()}
                className="p-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center"
                title="Send query to Groq"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Trajectory Chart & Memory (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Chart Container */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6E8EF] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1a1b22]">Revenue Trajectory & Pace</h3>
                <p className="text-xs text-[#787587]">Actual vs Baseline vs Target</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +₹3,740 Net Lift
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5440e1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#5440e1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E8EF" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#787587' }} stroke="#E6E8EF" />
                  <YAxis tick={{ fontSize: 10, fill: '#787587' }} stroke="#E6E8EF" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E6E8EF', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#5440e1" strokeWidth={2.5} fillOpacity={1} fill="url(#actualGradient)" name="Actual AI Revenue" />
                  <Area type="monotone" dataKey="baseline" stroke="#787587" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Baseline (Without AI)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#787587] pt-3 border-t border-[#E6E8EF] mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5440e1]"></span>
                <span>AI Optimized</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#787587]"></span>
                <span>Baseline</span>
              </div>
              <div className="font-semibold text-[#1a1b22]">
                Goal: ₹{activeMission.targetRevenue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Agent Memory & Learnings Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6E8EF] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5440e1]" />
                <h3 className="text-sm font-bold text-[#1a1b22]">Agent Long-Term Memory</h3>
              </div>
              <span className="text-[10px] font-mono text-[#787587]">Vector Insights (3)</span>
            </div>

            <div className="space-y-2.5">
              {agent.memoryInsights.map((mem) => (
                <div key={mem.id} className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF] hover:border-[#5440e1]/30 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#1a1b22]">{mem.title}</span>
                    <span className="text-[10px] font-mono text-[#5440e1] bg-[#F0EEFF] px-1.5 py-0.5 rounded">
                      {mem.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#474555] leading-relaxed">
                    {mem.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Transaction Ticker */}
          <div className="bg-white rounded-2xl p-5 border border-[#E6E8EF] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1a1b22]">Live Financial Stream</h3>
              <button
                onClick={() => setActiveTab('ledger')}
                className="text-xs text-[#5440e1] font-semibold hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {transactions.slice(0, 4).map((txn) => (
                <div key={txn.id} className="p-2.5 rounded-xl border border-[#E6E8EF] hover:bg-[#F7F8FC] transition-colors flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#1a1b22]">{txn.action}</div>
                    <div className="text-[10px] text-[#787587] font-mono">{txn.customer.name} • {txn.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono text-[#1a1b22]">₹{txn.amount.toLocaleString()}</div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                      txn.status === 'SUCCESS' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
