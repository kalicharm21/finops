import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AgentDashboard } from './components/agent/AgentDashboard';
import { MissionsView } from './components/missions/MissionsView';
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { PoliciesView } from './components/policies/PoliciesView';
import { LedgerView } from './components/ledger/LedgerView';
import { CampaignsView } from './components/campaigns/CampaignsView';
import { AuditView } from './components/audit/AuditView';
import { SimulationView } from './components/simulation/SimulationView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'agent':
        return <AgentDashboard />;
      case 'missions':
        return <MissionsView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'policies':
        return <PoliciesView />;
      case 'ledger':
        return <LedgerView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'audit':
        return <AuditView />;
      case 'simulation':
        return <SimulationView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <AgentDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F5F9] font-sans antialiased text-[#1a1b22] overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-[#F4F5F9]">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
