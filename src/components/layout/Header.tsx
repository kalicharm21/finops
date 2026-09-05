import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Play, 
  ShieldAlert, 
  ExternalLink,
  ChevronDown,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { 
    merchant, 
    agent, 
    notifications, 
    activeMission, 
    searchQuery, 
    setSearchQuery, 
    setActiveTab, 
    markNotificationRead,
    markAllNotificationsRead,
    simulateCustomerOrder,
    runAgentCycle,
    isProcessingCycle
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSimulateDropdown, setShowSimulateDropdown] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSimulate = async (type: 'coffee' | 'sandwich' | 'combo' | 'family') => {
    setIsSimulating(true);
    setShowSimulateDropdown(false);
    await simulateCustomerOrder(type);
    setIsSimulating(false);
  };

  return (
    <header className="h-16 bg-white border-b border-[#E6E8EF] px-6 flex items-center justify-between sticky top-0 z-30 card-shadow">
      {/* Search and context */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-[#787587] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, policies, audit events, campaigns... (⌘K)"
            className="w-full pl-9 pr-12 py-2 bg-[#F7F8FC] hover:bg-[#F4F5F9] focus:bg-white text-sm text-[#1a1b22] placeholder-[#787587] rounded-lg border border-[#E6E8EF] focus:border-[#5440e1] focus:ring-2 focus:ring-[#5440e1]/10 outline-none transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-[#787587] bg-white border border-[#E6E8EF] px-1.5 py-0.5 rounded shadow-xs">
            ⌘K
          </kbd>
        </div>

        {/* Live Ticker Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#F0EEFF] text-[#5440e1] rounded-full text-xs font-medium border border-[#5440e1]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#5440e1] animate-pulse" />
          <span className="truncate max-w-[220px]">Mission: {activeMission.name}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Simulator Button */}
        <div className="relative">
          <button
            id="header-quick-simulate-btn"
            onClick={() => setShowSimulateDropdown(!showSimulateDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors"
          >
            <Zap className={`w-3.5 h-3.5 text-emerald-600 ${isSimulating ? 'animate-bounce' : ''}`} />
            <span>Simulate Order</span>
            <ChevronDown className="w-3 h-3 text-emerald-600" />
          </button>

          {showSimulateDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E6E8EF] py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#787587] uppercase tracking-wider border-b border-[#E6E8EF]">
                Test Customer Purchase
              </div>
              <button
                onClick={() => handleSimulate('coffee')}
                className="w-full text-left px-3 py-2 text-xs text-[#1a1b22] hover:bg-[#F7F8FC] flex items-center justify-between"
              >
                <span>☕ Artisan Coffee</span>
                <span className="font-mono font-semibold text-emerald-600">₹180</span>
              </button>
              <button
                onClick={() => handleSimulate('sandwich')}
                className="w-full text-left px-3 py-2 text-xs text-[#1a1b22] hover:bg-[#F7F8FC] flex items-center justify-between"
              >
                <span>🥪 Panini Sandwich</span>
                <span className="font-mono font-semibold text-emerald-600">₹250</span>
              </button>
              <button
                onClick={() => handleSimulate('combo')}
                className="w-full text-left px-3 py-2 text-xs text-[#1a1b22] hover:bg-[#F0EEFF] flex items-center justify-between font-medium text-[#5440e1]"
              >
                <span>✨ Lunch Combo (AI Rec)</span>
                <span className="font-mono font-semibold text-[#5440e1]">₹399</span>
              </button>
              <button
                onClick={() => handleSimulate('family')}
                className="w-full text-left px-3 py-2 text-xs text-[#1a1b22] hover:bg-[#F7F8FC] flex items-center justify-between border-t border-[#E6E8EF]"
              >
                <span>🍽️ Family Meal</span>
                <span className="font-mono font-semibold text-emerald-600">₹599</span>
              </button>
            </div>
          )}
        </div>

        {/* Agent Run Cycle Button */}
        <button
          id="header-run-agent-cycle-btn"
          disabled={isProcessingCycle || agent.status !== 'ONLINE'}
          onClick={() => runAgentCycle()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5440e1] hover:bg-[#5B4BE7] disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isProcessingCycle ? 'animate-spin' : ''}`} />
          <span>{isProcessingCycle ? 'Agent Thinking...' : 'Run Agent Cycle'}</span>
        </button>

        {/* Test Mode Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Razorpay Test Mode</span>
        </div>

        {/* Agent Online Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#EAF9F1] border border-emerald-200 text-emerald-800 rounded-md text-xs font-medium">
          <span className={`w-2 h-2 rounded-full ${agent.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : agent.status === 'PAUSED' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
          <span className="font-semibold">{agent.status}</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold">{agent.autonomyLevel}% Auto</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#474555] hover:text-[#1a1b22] hover:bg-[#F7F8FC] rounded-lg transition-colors border border-transparent hover:border-[#E6E8EF]"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E6E8EF] py-2 z-50">
              <div className="px-4 py-2 flex items-center justify-between border-b border-[#E6E8EF]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1a1b22]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#5440e1] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#E6E8EF] custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-[#787587]">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkTo.includes('approvals')) setActiveTab('approvals');
                        if (n.linkTo.includes('transactions')) setActiveTab('ledger');
                        if (n.linkTo.includes('policies')) setActiveTab('policies');
                        if (n.linkTo.includes('campaigns')) setActiveTab('campaigns');
                        setShowNotifications(false);
                      }}
                      className={`px-4 py-3 hover:bg-[#F7F8FC] cursor-pointer transition-colors ${!n.read ? 'bg-indigo-50/40' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        {n.type === 'APPROVAL_REQUIRED' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />}
                        {n.type === 'PAYMENT_SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />}
                        {n.type === 'POLICY_VIOLATION' && <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#1a1b22]">{n.title}</p>
                          <p className="text-xs text-[#474555] line-clamp-2 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-[#787587] mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Merchant profile pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#E6E8EF]">
          <div className="w-8 h-8 rounded-full bg-[#5440e1] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            SC
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#1a1b22] leading-tight">{merchant.name}</div>
            <div className="text-[10px] text-[#787587]">Finance Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
