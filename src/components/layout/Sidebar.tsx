import React from 'react';
import { 
  Bot, 
  Target, 
  CheckSquare, 
  Scale, 
  Receipt, 
  Megaphone, 
  History, 
  Zap, 
  Settings, 
  Power,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    decisions, 
    activeMission, 
    agent, 
    emergencyStopAgent,
    pauseAgent,
    resumeAgent
  } = useApp();

  const pendingApprovalsCount = decisions.filter(
    d => d.decisionStatus === 'PROPOSED' && d.policyEvaluation.requiresApproval
  ).length;

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'agent', label: 'Agent Mission Control', icon: Bot },
    { id: 'missions', label: 'Revenue Missions', icon: Target },
    { id: 'approvals', label: 'Approvals Queue', icon: CheckSquare, badge: pendingApprovalsCount },
    { id: 'policies', label: 'Policy Guardrails', icon: Scale },
    { id: 'ledger', label: 'Intelligent Ledger', icon: Receipt },
    { id: 'campaigns', label: 'Growth Campaigns', icon: Megaphone },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'simulation', label: 'Sandbox Simulator', icon: Zap },
    { id: 'settings', label: 'Settings & Gateway', icon: Settings }
  ];

  const missionProgress = Math.min(100, Math.round((activeMission.currentRevenue / activeMission.targetRevenue) * 100));

  return (
    <aside className="w-64 bg-white border-r border-[#E6E8EF] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E6E8EF] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5440e1] to-[#7b6bff] flex items-center justify-center text-white shadow-md shadow-[#5440e1]/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-[#1a1b22] tracking-tight flex items-center gap-1.5">
              <span>FinOps AI</span>
              <span className="text-[10px] font-bold text-[#5440e1] bg-[#F0EEFF] px-1.5 py-0.2 rounded border border-[#5440e1]/20">v2.4</span>
            </div>
            <div className="text-[11px] font-medium text-[#787587]">Autonomous Revenue Engine</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#5440e1] text-white shadow-sm shadow-[#5440e1]/25'
                    : 'text-[#474555] hover:text-[#1a1b22] hover:bg-[#F4F5F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#787587]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-[#5440e1]' : 'bg-red-500 text-white animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom mission summary & kill-switch */}
      <div className="p-4 border-t border-[#E6E8EF] space-y-3 bg-[#F7F8FC]/60">
        {/* Active mission widget */}
        <div className="p-3 bg-white rounded-xl border border-[#E6E8EF] shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-[#1a1b22] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#5440e1]" />
              {activeMission.name}
            </span>
            <span className="font-mono font-bold text-[#5440e1]">{missionProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#E6E8EF] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#5440e1] to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${missionProgress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#787587]">
            <span>₹{activeMission.currentRevenue.toLocaleString()} / ₹{activeMission.targetRevenue.toLocaleString()}</span>
            <span className="font-semibold text-emerald-600 font-mono">{activeMission.currentROI}x ROI</span>
          </div>
        </div>

        {/* Kill switch & pause controls */}
        <div className="flex gap-2">
          {agent.status === 'ONLINE' ? (
            <button
              id="sidebar-pause-agent-btn"
              onClick={pauseAgent}
              className="flex-1 py-2 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Power className="w-3.5 h-3.5 text-amber-700" />
              <span>Pause Agent</span>
            </button>
          ) : (
            <button
              id="sidebar-resume-agent-btn"
              onClick={resumeAgent}
              className="flex-1 py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Resume Agent</span>
            </button>
          )}

          <button
            id="sidebar-emergency-stop-btn"
            onClick={emergencyStopAgent}
            title="Emergency Hard Stop: Lock all capital deployment"
            className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Kill</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
