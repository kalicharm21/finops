import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Mission, MissionStatus } from '../../types';

export const MissionsView: React.FC = () => {
  const { 
    missions, 
    activeMission, 
    selectMission, 
    createMission, 
    pauseMission, 
    resumeMission, 
    stopMission,
    setActiveTab
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RUNNING' | 'SCHEDULED' | 'PAUSED' | 'COMPLETED'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Mission Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetRevenue, setTargetRevenue] = useState(25000);
  const [budget, setBudget] = useState(5000);
  const [minimumROI, setMinimumROI] = useState(2.0);
  const [maximumSingleTransaction, setMaximumSingleTransaction] = useState(1500);
  const [stopLoss, setStopLoss] = useState(1000);
  const [approvalThreshold, setApprovalThreshold] = useState(1500);
  const [goalType, setGoalType] = useState<Mission['goalType']>('REVENUE_TARGET');

  const filteredMissions = missions.filter(m => {
    if (activeFilter === 'ALL') return true;
    return m.status === activeFilter;
  });

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createMission({
      name,
      description: description || `Autonomous ${goalType} sprint for Shio Café`,
      goalType,
      targetRevenue,
      budget,
      minimumROI,
      maximumSingleTransaction,
      stopLoss,
      approvalThreshold,
      status: 'SCHEDULED',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      projectedROI: minimumROI
    });

    setShowCreateModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1b22] tracking-tight">Revenue Missions</h1>
          <p className="text-xs text-[#787587] mt-0.5">
            Configure target objectives, capital ceilings, and ROI guardrails for the autonomous agent.
          </p>
        </div>

        <button
          id="create-mission-btn"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#5440e1] hover:bg-[#5B4BE7] text-white rounded-xl text-xs font-bold shadow-md shadow-[#5440e1]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Mission</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E8EF] pb-3 text-xs font-semibold">
        {(['ALL', 'RUNNING', 'SCHEDULED', 'PAUSED', 'COMPLETED'] as const).map((filter) => {
          const count = filter === 'ALL' ? missions.length : missions.filter(m => m.status === filter).length;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeFilter === filter
                  ? 'bg-[#5440e1] text-white shadow-xs'
                  : 'text-[#474555] hover:bg-[#F4F5F9]'
              }`}
            >
              <span>{filter === 'ALL' ? 'All Missions' : filter.charAt(0) + filter.slice(1).toLowerCase()}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeFilter === filter ? 'bg-white/20 text-white' : 'bg-[#E6E8EF] text-[#787587]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => {
          const isCurrentActive = mission.id === activeMission.id;
          const progress = Math.min(100, Math.round((mission.currentRevenue / mission.targetRevenue) * 100));
          const budgetUsedPct = Math.min(100, Math.round((mission.spent / mission.budget) * 100));

          return (
            <div
              key={mission.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between ${
                isCurrentActive ? 'border-[#5440e1] ring-2 ring-[#5440e1]/10' : 'border-[#E6E8EF] hover:border-[#5440e1]/40'
              }`}
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1a1b22]">{mission.name}</h3>
                      {isCurrentActive && (
                        <span className="text-[10px] font-bold text-[#5440e1] bg-[#F0EEFF] px-2 py-0.5 rounded-full border border-[#5440e1]/20">
                          Active Mission
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#787587] line-clamp-2 mt-1">{mission.description}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 border ${
                    mission.status === 'RUNNING' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    mission.status === 'SCHEDULED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    mission.status === 'PAUSED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {mission.status}
                  </span>
                </div>

                {/* Revenue Goal & Progress */}
                <div className="bg-[#F7F8FC] p-3.5 rounded-xl border border-[#E6E8EF] mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#787587]">Revenue Target:</span>
                    <span className="font-bold text-[#1a1b22] font-mono">
                      ₹{mission.currentRevenue.toLocaleString()} / ₹{mission.targetRevenue.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#E6E8EF] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5440e1] to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#787587]">
                    <span>{progress}% Target Achieved</span>
                    <span className="font-bold text-emerald-600 font-mono">
                      {mission.currentROI ? `${mission.currentROI}x Net ROI` : `Target ${mission.minimumROI}x`}
                    </span>
                  </div>
                </div>

                {/* Guardrail Parameters */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2.5 bg-white rounded-lg border border-[#E6E8EF]">
                    <div className="text-[10px] text-[#787587]">Budget Spent</div>
                    <div className="font-bold font-mono text-[#1a1b22] mt-0.5">
                      ₹{mission.spent.toLocaleString()} / ₹{mission.budget.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-[#E6E8EF]">
                    <div className="text-[10px] text-[#787587]">Max Single Txn</div>
                    <div className="font-bold font-mono text-[#5440e1] mt-0.5">
                      ₹{mission.maximumSingleTransaction.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-[#E6E8EF] flex items-center justify-between gap-2">
                {!isCurrentActive ? (
                  <button
                    onClick={() => selectMission(mission.id)}
                    className="flex-1 py-2 bg-[#F0EEFF] hover:bg-[#5440e1] text-[#5440e1] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <span>Set as Active Mission</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('agent')}
                    className="flex-1 py-2 bg-[#5440e1] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Mission Control</span>
                  </button>
                )}

                {mission.status === 'RUNNING' ? (
                  <button
                    onClick={() => pauseMission(mission.id)}
                    title="Pause Mission"
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => resumeMission(mission.id)}
                    title="Resume Mission"
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E6E8EF] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E8EF]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0EEFF] text-[#5440e1] flex items-center justify-center font-bold">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#1a1b22]">Create Financial Mission</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#787587] hover:text-[#1a1b22] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1a1b22] mb-1">Mission Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Weekend Footfall Surge"
                  className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-xs text-[#1a1b22] focus:border-[#5440e1] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1a1b22] mb-1">Strategic Goal Type</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-xs text-[#1a1b22] focus:border-[#5440e1] outline-none"
                >
                  <option value="REVENUE_TARGET">Revenue Target Acceleration</option>
                  <option value="USER_ACQUISITION">New Customer Acquisition</option>
                  <option value="CONVERSION_RECOVERY">Abandoned Cart Recovery</option>
                  <option value="RETENTION">Loyalty & Repeat Orders</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1a1b22] mb-1">Target Revenue (₹)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={targetRevenue}
                    onChange={(e) => setTargetRevenue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-xs font-mono font-bold text-[#1a1b22]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1a1b22] mb-1">Capital Budget (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-xs font-mono font-bold text-[#1a1b22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1a1b22] mb-1">Min ROI Hurdle (e.g. 2.0x)</label>
                  <input
                    type="number"
                    min="1.0"
                    step="0.1"
                    value={minimumROI}
                    onChange={(e) => setMinimumROI(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-xs font-mono font-bold text-[#1a1b22]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1a1b22] mb-1">Max Single Txn (₹)</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={maximumSingleTransaction}
                    onChange={(e) => setMaximumSingleTransaction(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-xs font-mono font-bold text-[#1a1b22]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E6E8EF] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#F4F5F9] text-[#474555] rounded-lg font-semibold hover:bg-[#E6E8EF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5440e1] hover:bg-[#5B4BE7] text-white rounded-lg font-bold shadow-sm"
                >
                  Create Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
