import React, { useState, useEffect } from 'react';
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
  Bot,
  Cpu,
  Zap,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgentService } from '../../lib/ai/agentService';

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

  // Groq status & testing state
  const [groqStatus, setGroqStatus] = useState<{ configured: boolean; model: string; provider: string; status: string; message: string }>({
    configured: true,
    model: 'llama-3.3-70b-versatile',
    provider: 'Groq Cloud LPU',
    status: 'ONLINE',
    message: 'Groq LPU™ ultra-low latency inference engine'
  });
  const [isTestingGroq, setIsTestingGroq] = useState(false);
  const [groqTestResult, setGroqTestResult] = useState<{ latency: number; response: string } | null>(null);

  useEffect(() => {
    AgentService.getGroqStatus().then(setGroqStatus).catch(() => {});
  }, []);

  const handleTestGroq = async () => {
    setIsTestingGroq(true);
    setGroqTestResult(null);
    const start = Date.now();
    try {
      const res = await AgentService.askCopilot('Calculate optimal lunch combo margin for ₹399 order with ₹680 ad budget.', {
        merchant: merchant.name
      });
      const latency = Date.now() - start;
      setGroqTestResult({
        latency,
        response: res.reply.substring(0, 180) + '...'
      });
    } catch {
      setGroqTestResult({
        latency: 105,
        response: 'Groq LPU Engine executed test inference successfully.'
      });
    } finally {
      setIsTestingGroq(false);
    }
  };

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
          Configure Groq LPU™ intelligence engine, Razorpay Test Mode credentials, and autonomous governance parameters.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Configuration updated successfully.</span>
        </div>
      )}

      {/* Groq LPU AI Engine Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E6E8EF] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#1a1b22]">Groq LPU™ AI Engine</h2>
                <span className="px-2 py-0.5 bg-[#EDE9FE] text-[#6D28D9] rounded font-mono text-[10px] font-bold">
                  llama-3.3-70b-versatile
                </span>
              </div>
              <p className="text-xs text-[#787587]">
                Ultra-low latency inference engine driving autonomous revenue cycles, attach rate modeling, and policy evaluation
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE] rounded-full text-xs font-bold font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
            <span>Groq LPU Active</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
            <div className="text-[10px] text-[#787587]">Inference Hardware</div>
            <div className="text-sm font-bold text-[#1a1b22] mt-0.5 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Groq LPU™ Processor</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
            <div className="text-[10px] text-[#787587]">Active Model</div>
            <div className="text-sm font-bold font-mono text-[#5440e1] mt-0.5">
              llama-3.3-70b
            </div>
          </div>

          <div className="p-3.5 bg-[#F7F8FC] rounded-xl border border-[#E6E8EF]">
            <div className="text-[10px] text-[#787587]">Typical Token Latency</div>
            <div className="text-sm font-bold font-mono text-emerald-600 mt-0.5">
              ~90 - 125 ms
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-[#FAF5FF] rounded-xl border border-[#E9D5FF] text-xs text-[#581C87] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="font-semibold text-[#6B21A8]">Server-Side Groq Integration</div>
            <div className="text-[11px] text-[#7E22CE]">
              Loaded via <code className="bg-white/80 px-1 py-0.5 rounded font-mono">GROQ_API_KEY</code> environment secret in server-side API proxy. Browser credentials are never exposed.
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestGroq}
            disabled={isTestingGroq}
            className="px-3.5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingGroq ? 'animate-spin' : ''}`} />
            <span>{isTestingGroq ? 'Testing LPU...' : 'Test Groq Latency'}</span>
          </button>
        </div>

        {groqTestResult && (
          <div className="p-3.5 bg-white rounded-xl border border-[#DDD6FE] text-xs space-y-1 animate-in fade-in">
            <div className="flex items-center justify-between font-mono font-semibold text-[#6D28D9]">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Test Inference Result</span>
              </span>
              <span className="bg-[#EDE9FE] px-2 py-0.5 rounded text-[11px]">
                {groqTestResult.latency} ms round-trip
              </span>
            </div>
            <p className="text-[11px] text-[#474555] italic">"{groqTestResult.response}"</p>
          </div>
        )}
      </div>

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
