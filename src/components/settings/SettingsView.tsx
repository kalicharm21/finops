import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Store, 
  ShieldCheck, 
  Check, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Save, 
  Lock,
  Sparkles,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { 
    merchant, 
    razorpayConfig, 
    updateRazorpayConfig, 
    agent, 
    setAgentAutonomy,
    resetDemoData
  } = useApp();

  const [keyId, setKeyId] = useState(razorpayConfig.keyId);
  const [keySecret, setKeySecret] = useState(razorpayConfig.keySecret);
  const [webhookSecret, setWebhookSecret] = useState(razorpayConfig.webhookSecret);
  const [showSecret, setShowSecret] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRazorpayConfig({
      keyId,
      keySecret,
      webhookSecret
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1b22] tracking-tight">Settings & Integrations</h1>
        <p className="text-xs text-[#787587] mt-0.5">
          Configure Razorpay Test Mode credentials, merchant baseline metrics, and autonomous governance parameters.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Configuration updated successfully.</span>
        </div>
      )}

      {/* Razorpay Gateway Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E8EF] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1a1b22]">Razorpay Integration (Test Mode)</h2>
              <p className="text-xs text-[#787587]">API keys for generating orders, payment links, and processing webhooks</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-mono">
            Connected (Test Mode)
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#1a1b22] mb-1">Razorpay Key ID</label>
            <input
              type="text"
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              placeholder="rzp_test_..."
              className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] font-mono text-[#1a1b22] focus:border-[#5440e1] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#1a1b22] mb-1">Razorpay Key Secret</label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={keySecret}
                onChange={(e) => setKeySecret(e.target.value)}
                placeholder="Key Secret"
                className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] font-mono text-[#1a1b22] focus:border-[#5440e1] outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787587] hover:text-[#1a1b22]"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1a1b22] mb-1">Webhook Signing Secret</label>
            <input
              type="password"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              placeholder="Webhook secret"
              className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] font-mono text-[#1a1b22] focus:border-[#5440e1] outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#5440e1] hover:bg-[#5B4BE7] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Gateway Credentials</span>
            </button>
          </div>
        </form>
      </div>

      {/* Merchant Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E8EF] shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E6E8EF]">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1a1b22]">Merchant Identity</h2>
            <p className="text-xs text-[#787587]">Profile and baseline metrics used to calculate AI revenue lift</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
            <div className="text-[10px] text-[#787587]">Merchant Name</div>
            <div className="text-sm font-bold text-[#1a1b22] mt-0.5">{merchant.name}</div>
          </div>

          <div className="p-3.5 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
            <div className="text-[10px] text-[#787587]">Default Currency</div>
            <div className="text-sm font-bold text-[#1a1b22] mt-0.5">{merchant.currency} ({merchant.currencySymbol})</div>
          </div>

          <div className="p-3.5 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
            <div className="text-[10px] text-[#787587]">Category</div>
            <div className="text-sm font-bold text-[#1a1b22] mt-0.5">{merchant.category}</div>
          </div>

          <div className="p-3.5 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
            <div className="text-[10px] text-[#787587]">Monthly Baseline Revenue</div>
            <div className="text-sm font-bold font-mono text-[#5440e1] mt-0.5">₹{merchant.monthlyBaselineRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
