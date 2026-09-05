import React, { useState } from 'react';
import { 
  CheckSquare, 
  AlertTriangle, 
  Check, 
  X, 
  Edit3, 
  ShieldAlert, 
  Clock, 
  ArrowUpRight, 
  UserCheck, 
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgentDecision } from '../../types';

export const ApprovalsView: React.FC = () => {
  const { 
    decisions, 
    approveDecision, 
    rejectDecision, 
    modifyAndApproveDecision 
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [modifyingId, setModifyingId] = useState<string | null>(null);
  const [modifiedAmount, setModifiedAmount] = useState<number>(1400);

  // Filter decisions
  const pendingDecisions = decisions.filter(d => 
    d.decisionStatus === 'PROPOSED' && d.policyEvaluation.requiresApproval
  );
  const approvedDecisions = decisions.filter(d => d.decisionStatus === 'APPROVED');
  const rejectedDecisions = decisions.filter(d => d.decisionStatus === 'REJECTED' || d.decisionStatus === 'BLOCKED');

  const getDisplayedList = () => {
    switch (activeTabFilter) {
      case 'PENDING': return pendingDecisions;
      case 'APPROVED': return approvedDecisions;
      case 'REJECTED': return rejectedDecisions;
      case 'ALL': return decisions;
    }
  };

  const handleReject = (decisionId: string) => {
    rejectDecision(decisionId, rejectReason || 'Declined by human reviewer');
    setRejectingId(null);
    setRejectReason('');
  };

  const handleModifyAndApprove = async (decisionId: string) => {
    await modifyAndApproveDecision(decisionId, modifiedAmount);
    setModifyingId(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1b22] tracking-tight flex items-center gap-2">
            <span>Human-in-the-Loop Approvals</span>
            {pendingDecisions.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                {pendingDecisions.length} Action Required
              </span>
            )}
          </h1>
          <p className="text-xs text-[#787587] mt-0.5">
            Autonomous proposals that breach policy thresholds and require verified human oversight.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E8EF] pb-3 text-xs font-semibold">
        <button
          id="approvals-tab-pending"
          onClick={() => setActiveTabFilter('PENDING')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTabFilter === 'PENDING'
              ? 'bg-[#5440e1] text-white shadow-xs'
              : 'text-[#474555] hover:bg-[#F4F5F9]'
          }`}
        >
          <span>Pending Review</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
            activeTabFilter === 'PENDING' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {pendingDecisions.length}
          </span>
        </button>

        <button
          id="approvals-tab-approved"
          onClick={() => setActiveTabFilter('APPROVED')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTabFilter === 'APPROVED'
              ? 'bg-[#5440e1] text-white shadow-xs'
              : 'text-[#474555] hover:bg-[#F4F5F9]'
          }`}
        >
          <span>Approved History</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
            activeTabFilter === 'APPROVED' ? 'bg-white/20 text-white' : 'bg-[#E6E8EF] text-[#787587]'
          }`}>
            {approvedDecisions.length}
          </span>
        </button>

        <button
          id="approvals-tab-rejected"
          onClick={() => setActiveTabFilter('REJECTED')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTabFilter === 'REJECTED'
              ? 'bg-[#5440e1] text-white shadow-xs'
              : 'text-[#474555] hover:bg-[#F4F5F9]'
          }`}
        >
          <span>Rejected / Blocked</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
            activeTabFilter === 'REJECTED' ? 'bg-white/20 text-white' : 'bg-[#E6E8EF] text-[#787587]'
          }`}>
            {rejectedDecisions.length}
          </span>
        </button>

        <button
          id="approvals-tab-all"
          onClick={() => setActiveTabFilter('ALL')}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTabFilter === 'ALL'
              ? 'bg-[#5440e1] text-white shadow-xs'
              : 'text-[#474555] hover:bg-[#F4F5F9]'
          }`}
        >
          <span>All Items</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
            activeTabFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-[#E6E8EF] text-[#787587]'
          }`}>
            {decisions.length}
          </span>
        </button>
      </div>

      {/* Decision Cards List */}
      <div className="space-y-4">
        {getDisplayedList().length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E6E8EF] shadow-xs">
            <CheckSquare className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-bold text-[#1a1b22]">Approvals Queue Clean</h3>
            <p className="text-xs text-[#787587] mt-1 max-w-sm mx-auto">
              No pending financial actions require human intervention right now. All autonomous transactions are passing within configured thresholds.
            </p>
          </div>
        ) : (
          getDisplayedList().map((decision) => {
            const isPending = decision.decisionStatus === 'PROPOSED' && decision.policyEvaluation.requiresApproval;
            const isApproved = decision.decisionStatus === 'APPROVED';
            const isRejected = decision.decisionStatus === 'REJECTED' || decision.decisionStatus === 'BLOCKED';

            return (
              <div
                key={decision.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                  isPending ? 'border-amber-300 ring-2 ring-amber-400/10' : 'border-[#E6E8EF]'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E6E8EF]">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPending ? 'bg-amber-100 text-amber-800' : isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isPending ? <AlertTriangle className="w-5 h-5" /> : isApproved ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#1a1b22]">{decision.proposedAction.title}</h3>
                        <span className="text-[10px] font-mono text-[#5440e1] bg-[#F0EEFF] px-2 py-0.5 rounded font-semibold">
                          {decision.proposedAction.vendor || decision.proposedAction.channel || 'Marketing'}
                        </span>
                      </div>
                      <div className="text-xs text-[#787587] flex items-center gap-3 mt-1 font-medium">
                        <span>Initiated by: <strong>{decision.proposedAction.details?.agentId || 'FinOps Agent'}</strong></span>
                        <span>•</span>
                        <span>{new Date(decision.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-600 font-bold">{decision.expectedROI}x Projected ROI</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-[#787587]">Requested Amount</div>
                    <div className="text-xl font-bold font-mono text-[#5440e1]">
                      ₹{decision.proposedAction.amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Flagged Reason Box (Screenshot 4 Callout) */}
                <div className="my-4 p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-amber-900">
                        Human-in-the-Loop Threshold Triggered
                      </div>
                      <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                        {decision.policyEvaluation.reason}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evidence & Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
                  <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
                    <div className="text-[10px] text-[#787587]">Expected Revenue</div>
                    <div className="font-bold font-mono text-emerald-600 text-sm mt-0.5">
                      ₹{decision.expectedRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
                    <div className="text-[10px] text-[#787587]">Confidence Score</div>
                    <div className="font-bold font-mono text-[#5440e1] text-sm mt-0.5">
                      {Math.round(decision.confidence * 100)}%
                    </div>
                  </div>
                  <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
                    <div className="text-[10px] text-[#787587]">Risk Classification</div>
                    <div className="font-bold text-emerald-600 text-sm mt-0.5">
                      {decision.riskLevel} Risk
                    </div>
                  </div>
                </div>

                {/* Reviewer signature if approved/rejected */}
                {decision.reviewer && (
                  <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF] flex items-center justify-between text-xs text-[#787587] mb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Reviewed by: <strong className="text-[#1a1b22]">{decision.reviewer.name}</strong></span>
                    </div>
                    <span>{new Date(decision.reviewer.timestamp).toLocaleTimeString()}</span>
                  </div>
                )}

                {/* Interactive Controls (For Pending Decisions) */}
                {isPending && (
                  <div className="pt-3 border-t border-[#E6E8EF] flex flex-wrap items-center justify-between gap-3">
                    {/* Modify form toggle */}
                    {modifyingId === decision.id ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs font-semibold text-[#1a1b22]">Set Amount: ₹</span>
                        <input
                          type="number"
                          value={modifiedAmount}
                          onChange={(e) => setModifiedAmount(Number(e.target.value))}
                          className="w-24 px-2 py-1 bg-[#F7F8FC] rounded-lg border border-[#5440e1] text-xs font-mono font-bold"
                        />
                        <button
                          onClick={() => handleModifyAndApprove(decision.id)}
                          className="px-3 py-1.5 bg-[#5440e1] text-white rounded-lg text-xs font-bold"
                        >
                          Approve ₹{modifiedAmount}
                        </button>
                        <button
                          onClick={() => setModifyingId(null)}
                          className="px-2 py-1.5 bg-[#F4F5F9] text-[#787587] rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : rejectingId === decision.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          placeholder="State reason for rejection..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-[#F7F8FC] rounded-lg border border-red-300 text-xs outline-none"
                        />
                        <button
                          onClick={() => handleReject(decision.id)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold"
                        >
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => setRejectingId(null)}
                          className="px-2 py-1.5 bg-[#F4F5F9] text-[#787587] rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 w-full">
                        <button
                          id={`approve-decision-${decision.id}`}
                          onClick={() => approveDecision(decision.id, 'Verified and approved by Sarah Jenkins')}
                          className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Full Amount (₹{decision.proposedAction.amount})</span>
                        </button>

                        <button
                          onClick={() => {
                            setModifyingId(decision.id);
                            setModifiedAmount(decision.proposedAction.amount - 450);
                          }}
                          className="px-4 py-2.5 bg-[#F0EEFF] hover:bg-[#5440e1] text-[#5440e1] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modify Amount</span>
                        </button>

                        <button
                          onClick={() => setRejectingId(decision.id)}
                          className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
