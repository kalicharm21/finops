import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Code, 
  X, 
  RotateCcw,
  Check,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionStatus } from '../../types';

export const LedgerView: React.FC = () => {
  const { transactions, refundTransaction } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TransactionStatus>('ALL');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const filtered = transactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      t.action.toLowerCase().includes(search.toLowerCase()) ||
      (t.razorpayPaymentId && t.razorpayPaymentId.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVolume = transactions.reduce((acc, t) => t.status === 'SUCCESS' ? acc + t.amount : acc, 0);
  const successCount = transactions.filter(t => t.status === 'SUCCESS').length;
  const successRate = transactions.length > 0 ? ((successCount / transactions.length) * 100).toFixed(1) : '100';

  const handleRefund = async () => {
    if (!selectedTxn) return;
    setIsRefunding(true);
    await refundTransaction(selectedTxn.id, refundReason || 'Customer requested refund via Ledger');
    setIsRefunding(false);
    setSelectedTxn(null);
    setRefundReason('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1b22] tracking-tight">Intelligent Transaction Ledger</h1>
          <p className="text-xs text-[#787587] mt-0.5">
            Full cryptographic transaction logs, automated executions, and Razorpay gateway settlements.
          </p>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E6E8EF] shadow-xs">
          <div className="text-xs text-[#787587] font-medium">Total Volume Captured</div>
          <div className="text-xl font-bold font-mono text-[#1a1b22] mt-1 font-financial-data">
            ₹{totalVolume.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E6E8EF] shadow-xs">
          <div className="text-xs text-[#787587] font-medium">Gateway Success Rate</div>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
            {successRate}%
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E6E8EF] shadow-xs">
          <div className="text-xs text-[#787587] font-medium">Total Transactions</div>
          <div className="text-xl font-bold font-mono text-[#5440e1] mt-1">
            {transactions.length} Records
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#E6E8EF] shadow-xs">
          <div className="text-xs text-[#787587] font-medium">Autonomous Origin</div>
          <div className="text-xl font-bold font-mono text-purple-600 mt-1">
            78% AI-Initiated
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6E8EF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#787587] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, customer name, action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-xs text-[#1a1b22] outline-none focus:border-[#5440e1]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {(['ALL', 'SUCCESS', 'PENDING', 'BLOCKED', 'REFUNDED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#5440e1] text-white shadow-xs'
                  : 'text-[#474555] hover:bg-[#F4F5F9]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl border border-[#E6E8EF] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FC] border-b border-[#E6E8EF] text-[#787587] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Transaction ID</th>
                <th className="px-5 py-3.5">Customer & Entity</th>
                <th className="px-5 py-3.5">Action / Type</th>
                <th className="px-5 py-3.5">Source & Policy</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Audit Trail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8EF]">
              {filtered.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="hover:bg-[#F7F8FC]/80 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono font-bold text-[#5440e1]">
                    <div>{txn.id}</div>
                    <div className="text-[10px] text-[#787587] font-normal">{new Date(txn.createdAt).toLocaleTimeString()}</div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="font-bold text-[#1a1b22]">{txn.customer.name}</div>
                    <div className="text-[10px] text-[#787587]">{txn.customer.email || 'direct_pos'}</div>
                  </td>

                  <td className="px-5 py-3.5 font-medium text-[#1a1b22]">
                    {txn.action}
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5440e1] font-semibold">
                      {txn.source}
                    </span>
                    <div className="text-[10px] text-[#787587] mt-0.5">{txn.policyApplied}</div>
                  </td>

                  <td className="px-5 py-3.5 font-bold font-mono text-[#1a1b22]">
                    ₹{txn.amount.toLocaleString()}
                  </td>

                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      txn.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      txn.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      txn.status === 'BLOCKED' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {txn.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTxn(txn);
                      }}
                      className="px-3 py-1 bg-[#F4F5F9] hover:bg-[#5440e1] text-[#474555] hover:text-white rounded-lg text-[11px] font-semibold transition-all"
                    >
                      View Steps
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Execution Trail Drawer (Screenshot 6 Layout) */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-end z-50">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E6E8EF]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-[#F0EEFF] text-[#5440e1] rounded">
                      {selectedTxn.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedTxn.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {selectedTxn.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#1a1b22] mt-1">{selectedTxn.action}</h2>
                  <div className="text-xs text-[#787587]">
                    Customer: <strong>{selectedTxn.customer.name}</strong> • Amount: <strong className="text-[#5440e1] font-mono">₹{selectedTxn.amount.toLocaleString()}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTxn(null)}
                  className="p-1.5 text-[#787587] hover:text-[#1a1b22] rounded-lg hover:bg-[#F4F5F9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Execution Trail Timeline (Screenshot 6) */}
              <div className="mt-6 space-y-6">
                <div className="text-xs font-bold text-[#1a1b22] uppercase tracking-wider">
                  Execution Trail & Gateways
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6E8EF]">
                  {(selectedTxn.executionTrail || [
                    { id: '1', name: 'Agent Intent', timestamp: '14:31:55', status: 'SUCCESS', description: `Agent generated order intent for ${selectedTxn.action}` },
                    { id: '2', name: 'Policy Evaluation', timestamp: '14:31:56', status: 'SUCCESS', description: `Checked against active policies. Policy: ${selectedTxn.policyApplied}` },
                    { id: '3', name: 'Gateway: Razorpay', timestamp: '14:31:58', status: 'INFO', description: 'POST /v1/orders/create -> 200 OK' },
                    { id: '4', name: 'Outcome: Success', timestamp: '14:32:01', status: 'SUCCESS', description: 'Payment captured and logged in audit ledger.' }
                  ]).map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Node circle */}
                      <span className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ring-4 ring-white ${
                        step.status === 'SUCCESS' ? 'bg-emerald-500' :
                        step.status === 'ERROR' ? 'bg-red-500' :
                        step.status === 'WARNING' ? 'bg-amber-500' : 'bg-[#5440e1]'
                      }`}>
                        {step.status === 'SUCCESS' ? <Check className="w-3 h-3" /> : idx + 1}
                      </span>

                      <div className="bg-[#F7F8FC] p-3.5 rounded-xl border border-[#E6E8EF]">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-[#1a1b22]">{step.name}</span>
                          <span className="text-[10px] font-mono text-[#787587]">{step.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#474555]">{step.description}</p>
                        
                        {step.codeSnippet && (
                          <pre className="mt-2 p-2 bg-[#1a1b22] text-emerald-400 rounded-lg text-[10px] font-mono overflow-x-auto">
                            {step.codeSnippet}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Refund option */}
            {selectedTxn.status === 'SUCCESS' && (
              <div className="pt-4 border-t border-[#E6E8EF] space-y-3">
                <input
                  type="text"
                  placeholder="State reason for refund (e.g., Customer requested)..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F8FC] rounded-lg border border-[#E6E8EF] text-xs outline-none"
                />
                <button
                  disabled={isRefunding}
                  onClick={handleRefund}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Issue Refund of ₹{selectedTxn.amount.toLocaleString()}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
