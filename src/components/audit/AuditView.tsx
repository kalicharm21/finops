import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  ArrowUpRight, 
  Check, 
  X, 
  ExternalLink,
  Bot,
  User,
  Scale,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditEvent } from '../../types';

export const AuditView: React.FC = () => {
  const { auditEvents, approveDecision, rejectDecision, setActiveTab } = useApp();

  const [search, setSearch] = useState('');
  const [filterActor, setFilterActor] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = auditEvents.filter(ev => {
    const matchesSearch = 
      ev.action.toLowerCase().includes(search.toLowerCase()) ||
      ev.reason.toLowerCase().includes(search.toLowerCase()) ||
      ev.actor.toLowerCase().includes(search.toLowerCase()) ||
      ev.correlationId.toLowerCase().includes(search.toLowerCase());

    const matchesActor = filterActor === 'ALL' || ev.actorType === filterActor;
    const matchesStatus = filterStatus === 'ALL' || ev.status === filterStatus;

    return matchesSearch && matchesActor && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1b22] tracking-tight">Cryptographic Audit Trail</h1>
          <p className="text-xs text-[#787587] mt-0.5">
            Immutable log of all AI intent formulations, policy validations, and operator authorizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#F0EEFF] text-[#5440e1] border border-[#5440e1]/20 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#5440e1]" />
            <span>SHA-256 Verifiable Chain</span>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6E8EF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#787587] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search intent, evidence ID, correlation hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-xs text-[#1a1b22] outline-none focus:border-[#5440e1]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setFilterActor('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterActor === 'ALL' ? 'bg-[#5440e1] text-white' : 'text-[#474555] hover:bg-[#F4F5F9]'}`}
          >
            All Actors
          </button>
          <button
            onClick={() => setFilterActor('AGENT')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterActor === 'AGENT' ? 'bg-[#5440e1] text-white' : 'text-[#474555] hover:bg-[#F4F5F9]'}`}
          >
            Agent Only
          </button>
          <button
            onClick={() => setFilterActor('POLICY_ENGINE')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterActor === 'POLICY_ENGINE' ? 'bg-[#5440e1] text-white' : 'text-[#474555] hover:bg-[#F4F5F9]'}`}
          >
            Policy Engine
          </button>
          <button
            onClick={() => setFilterActor('USER')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterActor === 'USER' ? 'bg-[#5440e1] text-white' : 'text-[#474555] hover:bg-[#F4F5F9]'}`}
          >
            Human Operators
          </button>
        </div>
      </div>

      {/* Audit Event Cards List (Matching Screenshot 1 & 8) */}
      <div className="space-y-5">
        {filtered.map((event) => {
          const isExecution = event.tag === 'Execution';
          const isEscalation = event.tag === 'Escalation' || event.status === 'WARNING';
          const isPolicyUpdate = event.tag === 'Policy Update';

          return (
            <div
              key={event.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                isEscalation ? 'border-amber-200 ring-2 ring-amber-400/10' : 'border-[#E6E8EF]'
              }`}
            >
              {/* Top Row: Event Title, Amount & Tag */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#E6E8EF]">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    event.actorType === 'AGENT' ? 'bg-[#F0EEFF] text-[#5440e1]' :
                    event.actorType === 'POLICY_ENGINE' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {event.actorType === 'AGENT' ? <Bot className="w-5 h-5" /> :
                     event.actorType === 'POLICY_ENGINE' ? <Scale className="w-5 h-5" /> :
                     <User className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1a1b22]">{event.action}</h3>
                      {event.amount !== undefined && (
                        <span className="text-sm font-bold font-mono text-[#5440e1]">
                          {typeof event.amount === 'number' && event.amount < 100 
                            ? `${event.amount}%` 
                            : `₹${event.amount.toLocaleString()}`}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#787587] flex items-center gap-2 mt-0.5 font-medium">
                      <span>Actor: <strong className="text-[#1a1b22]">{event.actor}</strong></span>
                      <span>•</span>
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-[#787587]">{event.correlationId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                    isExecution ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    isEscalation ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {event.tag || event.status}
                  </span>
                </div>
              </div>

              {/* Policy Checks Badges (Screenshot 1 / 8) */}
              {event.policyChecks && event.policyChecks.length > 0 && (
                <div className="my-3 flex flex-wrap items-center gap-2">
                  {event.policyChecks.map((check, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        check.passed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {check.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>{check.policyName}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* AI Intent & Rationale Box */}
              <div className="my-3 p-4 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
                <div className="text-[11px] font-bold text-[#787587] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5440e1]" />
                  <span>AI Intent & Operational Rationale</span>
                </div>
                <p className="text-xs text-[#1a1b22] leading-relaxed font-medium">
                  {event.reason}
                </p>
              </div>

              {/* Evidence Strip */}
              {event.evidence && event.evidence.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#E6E8EF]">
                  <div className="text-[10px] font-bold text-[#787587] uppercase tracking-wider mb-2">
                    Verified Evidence & Grounding Sources
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {event.evidence.map((evItem, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E6E8EF] rounded-lg text-[11px] text-[#474555] font-medium shadow-2xs"
                      >
                        <FileText className="w-3 h-3 text-[#5440e1]" />
                        <span>{evItem}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons for Escalated Events (Screenshot 8) */}
              {isEscalation && event.entityType === 'TRANSACTION' && (
                <div className="mt-4 pt-3 border-t border-[#E6E8EF] flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="px-4 py-2 bg-[#5440e1] hover:bg-[#5B4BE7] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    Open Approvals Queue
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
