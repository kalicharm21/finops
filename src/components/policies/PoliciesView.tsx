import React, { useState } from 'react';
import { 
  Scale, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  Lock, 
  Sparkles,
  Play,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Policy, PolicyType } from '../../types';

export const PoliciesView: React.FC = () => {
  const { policies, updatePolicy, togglePolicy } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Limits' | 'Performance' | 'Security' | 'Governance'>('All');
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Sandbox Tester State
  const [testAmount, setTestAmount] = useState<number>(1850);
  const [testROI, setTestROI] = useState<number>(3.8);
  const [testVendor, setTestVendor] = useState<string>('AdTech Solutions');

  const filteredPolicies = policies.filter(p => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  const handleStartEdit = (p: Policy) => {
    setEditingPolicy(p);
    setEditValue(String(p.value));
  };

  const handleSaveEdit = () => {
    if (!editingPolicy) return;
    const numVal = parseFloat(editValue);
    const finalVal = isNaN(numVal) ? editValue : numVal;
    
    let formatted = String(finalVal);
    if (typeof finalVal === 'number') {
      if (editingPolicy.unit === 'INR') formatted = `₹${finalVal.toLocaleString()}`;
      else if (editingPolicy.unit === 'x') formatted = `${finalVal}x`;
    }

    updatePolicy(editingPolicy.id, {
      value: finalVal,
      formattedValue: formatted
    });

    setEditingPolicy(null);
  };

  // Evaluate test inputs against current policies
  const testSingleTxnPolicy = policies.find(p => p.type === 'SINGLE_TRANSACTION_LIMIT');
  const testMinROIPolicy = policies.find(p => p.type === 'MINIMUM_ROI');
  const singleTxnLimit = testSingleTxnPolicy ? Number(testSingleTxnPolicy.value) : 1500;
  const minROILimit = testMinROIPolicy ? Number(testMinROIPolicy.value) : 2.0;

  const passesSingleTxn = testAmount <= singleTxnLimit;
  const passesROI = testROI >= minROILimit;
  const isRequiresApproval = !passesSingleTxn;
  const isBlocked = !passesROI;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1b22] tracking-tight">Policy Guardrails & Governance</h1>
          <p className="text-xs text-[#787587] mt-0.5">
            Deterministic rule constraints enforced on all autonomous spending and campaign actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Deterministic Enforcement Active</span>
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E8EF] pb-3 text-xs font-semibold">
        {(['All', 'Limits', 'Performance', 'Security', 'Governance'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              selectedCategory === cat
                ? 'bg-[#5440e1] text-white shadow-xs'
                : 'text-[#474555] hover:bg-[#F4F5F9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Policy Cards (Left 8 cols) + Sandbox Tester (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Policies List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between ${
                  policy.enabled ? 'border-[#E6E8EF] hover:border-[#5440e1]/40' : 'border-[#E6E8EF] opacity-60 bg-[#F7F8FC]'
                }`}
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#1a1b22]">{policy.name}</h3>
                        {policy.isAiManaged && (
                          <span className="text-[9px] font-bold text-[#5440e1] bg-[#F0EEFF] px-1.5 py-0.2 rounded font-mono">
                            AI Adaptive
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#787587] font-medium">{policy.category}</span>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      id={`policy-toggle-${policy.id}`}
                      onClick={() => togglePolicy(policy.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        policy.enabled ? 'bg-[#5440e1]' : 'bg-[#c8c4d8]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          policy.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Value display */}
                  <div className="my-3 p-3 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#787587]">Configured Limit</div>
                      <div className="text-lg font-bold text-[#5440e1] font-mono">
                        {policy.formattedValue}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartEdit(policy)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#5440e1] hover:bg-[#F0EEFF] rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  </div>

                  <p className="text-xs text-[#474555] leading-relaxed line-clamp-2 mb-3">
                    {policy.description}
                  </p>
                </div>

                {/* Footer status */}
                <div className="pt-3 border-t border-[#E6E8EF] flex items-center justify-between text-[11px]">
                  <span className={`px-2 py-0.5 rounded font-semibold font-mono ${
                    policy.severity === 'BLOCK' ? 'bg-red-50 text-red-700' :
                    policy.severity === 'REQUIRE_APPROVAL' ? 'bg-amber-50 text-amber-700' :
                    'bg-indigo-50 text-indigo-700'
                  }`}>
                    {policy.severity === 'BLOCK' ? 'Strict Block' : policy.severity === 'REQUIRE_APPROVAL' ? 'Escalate to Review' : 'Log Warning'}
                  </span>
                  <span className="text-[#787587]">Updated recently</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sandbox Calculator / Tester */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E6E8EF] shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#E6E8EF]">
              <Sparkles className="w-4 h-4 text-[#5440e1]" />
              <h3 className="text-sm font-bold text-[#1a1b22]">Guardrail Sandbox Tester</h3>
            </div>

            <p className="text-xs text-[#787587] mb-4 leading-relaxed">
              Test how the deterministic engine evaluates arbitrary transaction parameters in real-time.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1a1b22] mb-1">Simulated Amount (₹)</label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] font-mono font-bold text-[#1a1b22]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1a1b22] mb-1">Expected ROI (x)</label>
                <input
                  type="number"
                  step="0.1"
                  value={testROI}
                  onChange={(e) => setTestROI(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] font-mono font-bold text-[#1a1b22]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1a1b22] mb-1">Vendor / Beneficiary</label>
                <input
                  type="text"
                  value={testVendor}
                  onChange={(e) => setTestVendor(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-[#1a1b22]"
                />
              </div>

              {/* Evaluation Outcome Box */}
              <div className={`p-3.5 rounded-xl border mt-4 ${
                isBlocked
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : isRequiresApproval
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="font-bold flex items-center justify-between text-xs mb-1">
                  <span>Engine Outcome:</span>
                  <span className="font-mono uppercase font-bold">
                    {isBlocked ? 'BLOCKED' : isRequiresApproval ? 'REQUIRES APPROVAL' : 'AUTO-APPROVED'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {isBlocked
                    ? `ROI ${testROI}x is below the minimum ${minROILimit}x required threshold.`
                    : isRequiresApproval
                    ? `Amount ₹${testAmount.toLocaleString()} exceeds ₹${singleTxnLimit.toLocaleString()} single transaction limit. Escalated to Human-in-the-Loop.`
                    : `Transaction satisfies all limits and passes autonomous clearance.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPolicy && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-[#E6E8EF] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#1a1b22]">Edit {editingPolicy.name}</h3>
            <div>
              <label className="block text-xs font-semibold text-[#787587] mb-1">Value ({editingPolicy.unit})</label>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-sm font-mono font-bold"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingPolicy(null)}
                className="px-4 py-2 bg-[#F4F5F9] text-[#474555] rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#5440e1] text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Save Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
