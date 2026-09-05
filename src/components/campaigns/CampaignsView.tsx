import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Mail, 
  Send,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Campaign } from '../../types';

export const CampaignsView: React.FC = () => {
  const { campaigns, stopCampaign } = useApp();

  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'>('ALL');
  const [haltingId, setHaltingId] = useState<string | null>(null);
  const [haltReason, setHaltReason] = useState('');

  const filtered = campaigns.filter(c => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  const totalReach = campaigns.reduce((acc, c) => acc + c.totalSent, 0);
  const totalRev = campaigns.reduce((acc, c) => acc + c.revenueGenerated, 0);
  const totalSpent = campaigns.reduce((acc, c) => acc + c.budgetSpent, 0);

  const handleStop = (id: string) => {
    stopCampaign(id, haltReason || 'Operator manual stop');
    setHaltingId(null);
    setHaltReason('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1b22] tracking-tight">Growth & Revenue Campaigns</h1>
          <p className="text-xs text-[#787587] mt-0.5">
            Autonomous multi-channel discount links, recovery nudges, and promotional attachments.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E6E8EF] shadow-xs">
          <div className="text-xs text-[#787587]">Total Campaign Reach</div>
          <div className="text-xl font-bold font-mono text-[#1a1b22] mt-1 font-financial-data">
            {totalReach.toLocaleString()} patrons
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E6E8EF] shadow-xs">
          <div className="text-xs text-[#787587]">Direct Revenue Generated</div>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1 font-financial-data">
            ₹{totalRev.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E6E8EF] shadow-xs">
          <div className="text-xs text-[#787587]">Total Ad Capital Spent</div>
          <div className="text-xl font-bold font-mono text-[#5440e1] mt-1 font-financial-data">
            ₹{totalSpent.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E6E8EF] shadow-xs">
          <div className="text-xs text-[#787587]">Blended Portfolio ROI</div>
          <div className="text-xl font-bold font-mono text-purple-600 mt-1">
            {totalSpent > 0 ? (totalRev / totalSpent).toFixed(1) : '5.8'}x
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E8EF] pb-3 text-xs font-semibold">
        {(['ALL', 'ACTIVE', 'PAUSED', 'COMPLETED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              filter === tab
                ? 'bg-[#5440e1] text-white shadow-xs'
                : 'text-[#474555] hover:bg-[#F4F5F9]'
            }`}
          >
            {tab === 'ALL' ? 'All Campaigns' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-2xl border border-[#E6E8EF] p-5 shadow-xs flex flex-col justify-between hover:border-[#5440e1]/30 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#1a1b22]">{camp.name}</h3>
                    <span className="text-[10px] font-mono text-[#5440e1] bg-[#F0EEFF] px-2 py-0.5 rounded font-semibold">
                      {camp.channel}
                    </span>
                  </div>
                  <p className="text-xs text-[#787587] mt-1">Target: {camp.targetAudience}</p>
                </div>

                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                  camp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  camp.status === 'PAUSED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {camp.status}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 my-4 text-xs">
                <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
                  <div className="text-[10px] text-[#787587]">Audience Sent</div>
                  <div className="text-sm font-bold font-mono text-[#1a1b22] mt-0.5">
                    {camp.totalSent.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
                  <div className="text-[10px] text-[#787587]">Conversion Rate</div>
                  <div className="text-sm font-bold font-mono text-emerald-600 mt-0.5">
                    {camp.conversionRate}%
                  </div>
                </div>

                <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
                  <div className="text-[10px] text-[#787587]">Revenue / ROI</div>
                  <div className="text-sm font-bold font-mono text-[#5440e1] mt-0.5">
                    ₹{camp.revenueGenerated.toLocaleString()} ({camp.actualROI}x)
                  </div>
                </div>
              </div>

              {/* Budget usage bar */}
              <div className="space-y-1 text-xs mb-4">
                <div className="flex justify-between text-[11px] text-[#787587]">
                  <span>Budget Consumed: ₹{camp.budgetSpent.toLocaleString()} / ₹{camp.budgetAllocated.toLocaleString()}</span>
                  <span className="font-semibold text-[#1a1b22]">
                    {Math.round((camp.budgetSpent / camp.budgetAllocated) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#F4F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5440e1] rounded-full"
                    style={{ width: `${Math.min(100, (camp.budgetSpent / camp.budgetAllocated) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Footer / Stop controls */}
            <div className="pt-3 border-t border-[#E6E8EF] flex items-center justify-between">
              <span className="text-[11px] text-[#787587]">
                Created {new Date(camp.createdAt).toLocaleDateString()}
              </span>

              {camp.status === 'ACTIVE' && (
                haltingId === camp.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Halt reason..."
                      value={haltReason}
                      onChange={(e) => setHaltReason(e.target.value)}
                      className="px-2 py-1 bg-[#F7F8FC] rounded border border-red-300 text-xs"
                    />
                    <button
                      onClick={() => handleStop(camp.id)}
                      className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-bold"
                    >
                      Halt
                    </button>
                    <button
                      onClick={() => setHaltingId(null)}
                      className="px-2 py-1 text-xs text-[#787587]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setHaltingId(camp.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Halt Campaign
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
