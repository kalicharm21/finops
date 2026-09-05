import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Merchant, 
  Mission, 
  Agent, 
  Policy, 
  Transaction, 
  AgentDecision, 
  Campaign, 
  AuditEvent, 
  Notification,
  RazorpayConfig,
  ActionType
} from '../types';
import { StorageRepository } from '../lib/storage/repository';
import { AgentService } from '../lib/ai/agentService';
import { PolicyEngine } from '../lib/policies/engine';
import { RazorpaySimulator } from '../lib/razorpay/client';

export type NavigationTab = 
  | 'agent' 
  | 'missions' 
  | 'approvals' 
  | 'policies' 
  | 'ledger' 
  | 'campaigns' 
  | 'audit' 
  | 'settings'
  | 'simulation';

interface AppContextType {
  merchant: Merchant;
  agent: Agent;
  missions: Mission[];
  activeMission: Mission;
  policies: Policy[];
  campaigns: Campaign[];
  decisions: AgentDecision[];
  transactions: Transaction[];
  auditEvents: AuditEvent[];
  notifications: Notification[];
  razorpayConfig: RazorpayConfig;
  activeTab: NavigationTab;
  searchQuery: string;
  isProcessingCycle: boolean;
  liveFeedTicker: string;
  
  // Navigation & UI
  setActiveTab: (tab: NavigationTab) => void;
  setSearchQuery: (query: string) => void;
  selectMission: (missionId: string) => void;

  // Agent Controls
  pauseAgent: () => void;
  resumeAgent: () => void;
  emergencyStopAgent: () => void;
  setAgentAutonomy: (level: number) => void;
  runAgentCycle: () => Promise<AgentDecision | null>;

  // Mission Management
  createMission: (mission: Omit<Mission, 'id' | 'createdAt' | 'updatedAt' | 'currentRevenue' | 'spent' | 'currentROI'>) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  pauseMission: (id: string) => void;
  resumeMission: (id: string) => void;
  stopMission: (id: string) => void;

  // Decision & Approvals
  approveDecision: (decisionId: string, comment?: string) => Promise<void>;
  rejectDecision: (decisionId: string, reason: string) => void;
  modifyAndApproveDecision: (decisionId: string, newAmount: number, comment?: string) => Promise<void>;

  // Policies
  updatePolicy: (id: string, updates: Partial<Policy>) => void;
  togglePolicy: (id: string) => void;

  // Transactions & Gateway
  createManualTransaction: (amount: number, customerName: string, action: string) => Promise<Transaction>;
  refundTransaction: (transactionId: string, reason?: string) => Promise<void>;

  // Campaigns
  stopCampaign: (campaignId: string, reason?: string) => void;

  // Live Simulation & Demo Tools
  simulateCustomerOrder: (type: 'coffee' | 'sandwich' | 'combo' | 'family') => Promise<Transaction>;
  simulateFailure: (scenario: 'budget_limit' | 'low_roi' | 'unrecognized_vendor' | 'agent_paused') => Promise<AgentDecision>;
  updateRazorpayConfig: (config: Partial<RazorpayConfig>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [merchant, setMerchant] = useState<Merchant>(() => StorageRepository.getMerchant());
  const [agent, setAgent] = useState<Agent>(() => StorageRepository.getAgent());
  const [missions, setMissions] = useState<Mission[]>(() => StorageRepository.getMissions());
  const [policies, setPolicies] = useState<Policy[]>(() => StorageRepository.getPolicies());
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => StorageRepository.getCampaigns());
  const [decisions, setDecisions] = useState<AgentDecision[]>(() => StorageRepository.getDecisions());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageRepository.getTransactions());
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => StorageRepository.getAuditEvents());
  const [notifications, setNotifications] = useState<Notification[]>(() => StorageRepository.getNotifications());
  const [razorpayConfig, setRazorpayConfig] = useState<RazorpayConfig>(() => StorageRepository.getRazorpayConfig());

  const [activeTab, setActiveTab] = useState<NavigationTab>('agent');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessingCycle, setIsProcessingCycle] = useState(false);
  const [liveFeedTicker, setLiveFeedTicker] = useState('Agent operating normally • All 14 policy guardrails passing');

  // Derive active mission
  const activeMission = missions.find(m => m.id === agent.currentMissionId) || missions[0] || {
    id: 'mission_default',
    name: 'Revenue Sprint',
    description: 'Active financial mission',
    goalType: 'REVENUE_TARGET',
    targetRevenue: 20000,
    currentRevenue: 13420,
    budget: 5000,
    spent: 2480,
    minimumROI: 2.0,
    maximumSingleTransaction: 1500,
    stopLoss: 1000,
    approvalThreshold: 1500,
    status: 'RUNNING',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectedROI: 5.4,
    currentROI: 5.41
  };

  // Sync state to storage
  useEffect(() => {
    StorageRepository.saveMerchant(merchant);
  }, [merchant]);

  useEffect(() => {
    StorageRepository.saveAgent(agent);
  }, [agent]);

  useEffect(() => {
    StorageRepository.saveMissions(missions);
  }, [missions]);

  useEffect(() => {
    StorageRepository.savePolicies(policies);
  }, [policies]);

  useEffect(() => {
    StorageRepository.saveCampaigns(campaigns);
  }, [campaigns]);

  useEffect(() => {
    StorageRepository.saveDecisions(decisions);
  }, [decisions]);

  useEffect(() => {
    StorageRepository.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    StorageRepository.saveAuditEvents(auditEvents);
  }, [auditEvents]);

  useEffect(() => {
    StorageRepository.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    StorageRepository.saveRazorpayConfig(razorpayConfig);
  }, [razorpayConfig]);

  // Mission selection
  const selectMission = useCallback((missionId: string) => {
    setAgent(prev => ({
      ...prev,
      currentMissionId: missionId
    }));
  }, []);

  // Agent controls
  const pauseAgent = useCallback(() => {
    setAgent(prev => ({ ...prev, status: 'PAUSED' }));
    setLiveFeedTicker('Agent PAUSED by operator • Autonomous execution halted');
    
    // Log audit
    const event: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Human Operator',
      actorType: 'USER',
      action: 'Agent Paused',
      entityType: 'AGENT',
      entityId: agent.id,
      intent: 'Operator manually paused autonomous operations',
      reason: 'Manual intervention from mission control dashboard.',
      evidence: ['Manual button trigger: Pause Agent'],
      status: 'WARNING',
      correlationId: `corr_agent_${Date.now()}`,
      tag: 'User Action'
    };
    setAuditEvents(prev => [event, ...prev]);

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: 'Agent Paused',
        message: 'FinOps AI engine has been paused. All pending decisions are held.',
        type: 'AGENT_PAUSED',
        timestamp: new Date().toISOString(),
        read: false,
        linkTo: '/agent'
      },
      ...prev
    ]);
  }, [agent.id]);

  const resumeAgent = useCallback(() => {
    setAgent(prev => ({ ...prev, status: 'ONLINE' }));
    setLiveFeedTicker('Agent ONLINE • Monitoring cash flow & running live policy checks');
    
    const event: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Human Operator',
      actorType: 'USER',
      action: 'Agent Resumed',
      entityType: 'AGENT',
      entityId: agent.id,
      intent: 'Operator resumed autonomous agent operations',
      reason: 'Manual intervention to re-enable autonomous lifecycle.',
      evidence: ['Manual button trigger: Resume Agent'],
      status: 'SUCCESS',
      correlationId: `corr_agent_${Date.now()}`,
      tag: 'User Action'
    };
    setAuditEvents(prev => [event, ...prev]);
  }, [agent.id]);

  const emergencyStopAgent = useCallback(() => {
    setAgent(prev => ({ ...prev, status: 'STOPPED' }));
    setLiveFeedTicker('EMERGENCY STOP ENGAGED • All outbound financial capabilities locked');

    const event: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Human Operator',
      actorType: 'USER',
      action: 'Emergency Stop Triggered',
      entityType: 'AGENT',
      entityId: agent.id,
      intent: 'Immediate halt of all financial operations',
      reason: 'Emergency Kill-Switch invoked from mission control.',
      evidence: ['Hard kill-switch engaged in Live Mission Control'],
      status: 'BLOCKED',
      correlationId: `corr_kill_${Date.now()}`,
      tag: 'Escalation'
    };
    setAuditEvents(prev => [event, ...prev]);

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: 'Emergency Stop Active',
        message: 'All autonomous spending and campaign links have been locked.',
        type: 'POLICY_VIOLATION',
        timestamp: new Date().toISOString(),
        read: false,
        linkTo: '/agent'
      },
      ...prev
    ]);
  }, [agent.id]);

  const setAgentAutonomy = useCallback((level: number) => {
    setAgent(prev => ({ ...prev, autonomyLevel: level }));
    
    const event: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Human Operator',
      actorType: 'USER',
      action: `Autonomy Level Adjusted to ${level}%`,
      entityType: 'AGENT',
      entityId: agent.id,
      intent: 'Update agent autonomous clearance threshold',
      reason: `Operator dialed autonomy slider to ${level}%.`,
      evidence: [`Slider event: ${level}%`],
      status: 'SUCCESS',
      correlationId: `corr_auto_${Date.now()}`,
      tag: 'User Action'
    };
    setAuditEvents(prev => [event, ...prev]);
  }, [agent.id]);

  // Run autonomous cycle
  const runAgentCycle = useCallback(async (): Promise<AgentDecision | null> => {
    setIsProcessingCycle(true);
    setLiveFeedTicker('Agent analyzing real-time sales stream and calculating ROI models...');

    try {
      // Formulate decision
      const decision = await AgentService.formulateDecision(activeMission, policies, agent);

      setDecisions(prev => [decision, ...prev]);
      setAgent(prev => ({
        ...prev,
        lastDecisionAt: new Date().toISOString(),
        eventsProcessed: prev.eventsProcessed + 14,
        actionsToday: prev.actionsToday + 1
      }));

      // If requires approval, alert human
      if (decision.policyEvaluation.requiresApproval) {
        setLiveFeedTicker(`Decision flagged for Human Approval: ${decision.proposedAction.title}`);
        setNotifications(prev => [
          {
            id: `notif_${Date.now()}`,
            title: 'New Approval Required',
            message: `${decision.proposedAction.title} requires review: ${decision.policyEvaluation.reason}`,
            type: 'APPROVAL_REQUIRED',
            timestamp: new Date().toISOString(),
            read: false,
            linkTo: '/approvals',
            entityId: decision.id
          },
          ...prev
        ]);
      } else if (decision.policyEvaluation.allowed) {
        // Execute autonomously
        setLiveFeedTicker(`Autonomous execution triggered: ${decision.proposedAction.title}`);
        const result = await AgentService.executeDecision(decision, activeMission, {
          name: 'FinOps Autonomous Engine',
          type: 'AGENT'
        });

        // Update decisions
        setDecisions(prev => prev.map(d => d.id === decision.id ? result.decision : d));

        // Update transaction if generated
        if (result.transaction) {
          setTransactions(prev => [result.transaction!, ...prev]);
        }

        // Update campaign if generated
        if (result.campaign) {
          setCampaigns(prev => [result.campaign!, ...prev]);
        }

        // Update audit
        setAuditEvents(prev => [result.auditEvent, ...prev]);

        // Update mission spent
        setMissions(prev => prev.map(m => {
          if (m.id === activeMission.id) {
            const newSpent = m.spent + decision.proposedAction.amount;
            const newRev = m.currentRevenue;
            const currentROI = newSpent > 0 ? Number((newRev / newSpent).toFixed(2)) : 0;
            return {
              ...m,
              spent: newSpent,
              currentROI,
              updatedAt: new Date().toISOString()
            };
          }
          return m;
        }));

        setNotifications(prev => [
          {
            id: `notif_${Date.now()}`,
            title: 'Campaign Launched Autonomously',
            message: `${decision.proposedAction.title} executed with budget ₹${decision.proposedAction.amount}.`,
            type: 'PAYMENT_SUCCESS',
            timestamp: new Date().toISOString(),
            read: false,
            linkTo: '/campaigns',
            entityId: decision.id
          },
          ...prev
        ]);
      } else {
        // Blocked
        setLiveFeedTicker(`Action Blocked by Policy Engine: ${decision.policyEvaluation.reason}`);
        setAgent(prev => ({
          ...prev,
          blockedActions: prev.blockedActions + 1
        }));
        
        const blockAudit: AuditEvent = {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'Policy Engine',
          actorType: 'POLICY_ENGINE',
          action: `Blocked: ${decision.proposedAction.title}`,
          entityType: 'DECISION',
          entityId: decision.id,
          intent: decision.intent,
          reason: decision.policyEvaluation.reason,
          evidence: decision.evidence,
          policyChecks: decision.policyEvaluation.checks,
          status: 'BLOCKED',
          correlationId: `corr_${decision.id}`,
          amount: decision.proposedAction.amount,
          tag: 'Escalation'
        };
        setAuditEvents(prev => [blockAudit, ...prev]);
      }

      return decision;
    } finally {
      setIsProcessingCycle(false);
    }
  }, [activeMission, policies, agent]);

  // Approvals management
  const approveDecision = useCallback(async (decisionId: string, comment?: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision) return;

    const result = await AgentService.executeDecision(decision, activeMission, {
      name: 'Sarah Jenkins (Finance Lead)',
      type: 'USER'
    });

    const updatedDecision: AgentDecision = {
      ...result.decision,
      decisionStatus: 'APPROVED',
      executionStatus: 'EXECUTED',
      reviewer: {
        id: 'usr_sarah',
        name: 'Sarah Jenkins',
        timestamp: new Date().toISOString(),
        comment: comment || 'Manual approval override granted.'
      }
    };

    setDecisions(prev => prev.map(d => d.id === decisionId ? updatedDecision : d));
    if (result.transaction) setTransactions(prev => [result.transaction!, ...prev]);
    if (result.campaign) setCampaigns(prev => [result.campaign!, ...prev]);
    setAuditEvents(prev => [result.auditEvent, ...prev]);

    // Update mission spent
    setMissions(prev => prev.map(m => {
      if (m.id === activeMission.id) {
        const newSpent = m.spent + decision.proposedAction.amount;
        const currentROI = newSpent > 0 ? Number((m.currentRevenue / newSpent).toFixed(2)) : 0;
        return {
          ...m,
          spent: newSpent,
          currentROI,
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    }));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: 'Decision Approved',
        message: `You approved ₹${decision.proposedAction.amount} for ${decision.proposedAction.title}.`,
        type: 'PAYMENT_SUCCESS',
        timestamp: new Date().toISOString(),
        read: false,
        linkTo: '/approvals'
      },
      ...prev
    ]);
  }, [decisions, activeMission]);

  const rejectDecision = useCallback((decisionId: string, reason: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision) return;

    const rejected: AgentDecision = {
      ...decision,
      decisionStatus: 'REJECTED',
      executionStatus: 'FAILED',
      reviewer: {
        id: 'usr_sarah',
        name: 'Sarah Jenkins',
        timestamp: new Date().toISOString(),
        comment: reason
      }
    };

    setDecisions(prev => prev.map(d => d.id === decisionId ? rejected : d));

    const audit: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Sarah Jenkins',
      actorType: 'USER',
      action: `Rejected: ${decision.proposedAction.title}`,
      entityType: 'DECISION',
      entityId: decision.id,
      intent: 'Human Operator declined proposed automated budget allocation',
      reason: reason || 'Operator marked as unnecessary or high risk.',
      evidence: ['Manual rejection by Finance Lead'],
      status: 'ERROR',
      correlationId: `corr_${decision.id}`,
      amount: decision.proposedAction.amount,
      tag: 'User Action'
    };
    setAuditEvents(prev => [audit, ...prev]);
  }, [decisions]);

  const modifyAndApproveDecision = useCallback(async (decisionId: string, newAmount: number, comment?: string) => {
    const decision = decisions.find(d => d.id === decisionId);
    if (!decision) return;

    const modifiedDecision: AgentDecision = {
      ...decision,
      proposedAction: {
        ...decision.proposedAction,
        amount: newAmount
      },
      expectedCost: newAmount,
      expectedROI: newAmount > 0 ? Number((decision.expectedRevenue / newAmount).toFixed(2)) : 0
    };

    const result = await AgentService.executeDecision(modifiedDecision, activeMission, {
      name: 'Sarah Jenkins (Modified Amount)',
      type: 'USER'
    });

    const finalDecision: AgentDecision = {
      ...result.decision,
      decisionStatus: 'APPROVED',
      executionStatus: 'EXECUTED',
      reviewer: {
        id: 'usr_sarah',
        name: 'Sarah Jenkins',
        timestamp: new Date().toISOString(),
        comment: comment ? `Modified to ₹${newAmount}. ${comment}` : `Modified spend from ₹${decision.proposedAction.amount} to ₹${newAmount}`
      }
    };

    setDecisions(prev => prev.map(d => d.id === decisionId ? finalDecision : d));
    if (result.transaction) setTransactions(prev => [result.transaction!, ...prev]);
    if (result.campaign) setCampaigns(prev => [result.campaign!, ...prev]);
    setAuditEvents(prev => [result.auditEvent, ...prev]);

    setMissions(prev => prev.map(m => {
      if (m.id === activeMission.id) {
        const newSpent = m.spent + newAmount;
        const currentROI = newSpent > 0 ? Number((m.currentRevenue / newSpent).toFixed(2)) : 0;
        return {
          ...m,
          spent: newSpent,
          currentROI,
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    }));
  }, [decisions, activeMission]);

  // Policy updates
  const updatePolicy = useCallback((id: string, updates: Partial<Policy>) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    
    const event: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Sarah Jenkins',
      actorType: 'USER',
      action: `Policy Updated: ${id}`,
      entityType: 'POLICY',
      entityId: id,
      intent: 'Adjust guardrail threshold parameters',
      reason: `Updated policy config values.`,
      evidence: [JSON.stringify(updates)],
      status: 'SUCCESS',
      correlationId: `corr_pol_${Date.now()}`,
      tag: 'User Action'
    };
    setAuditEvents(prev => [event, ...prev]);
  }, []);

  const togglePolicy = useCallback((id: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        const newEnabled = !p.enabled;
        const event: AuditEvent = {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'Sarah Jenkins',
          actorType: 'USER',
          action: `Policy ${newEnabled ? 'Enabled' : 'Disabled'}: ${p.name}`,
          entityType: 'POLICY',
          entityId: id,
          intent: `${newEnabled ? 'Enforce' : 'Disable'} guardrail rule`,
          reason: `Toggled via policy manager.`,
          evidence: [`Enabled: ${newEnabled}`],
          status: newEnabled ? 'SUCCESS' : 'WARNING',
          correlationId: `corr_pol_${Date.now()}`,
          tag: 'User Action'
        };
        setAuditEvents(evs => [event, ...evs]);
        return { ...p, enabled: newEnabled, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
  }, []);

  // Mission management
  const createMission = useCallback((missionData: Omit<Mission, 'id' | 'createdAt' | 'updatedAt' | 'currentRevenue' | 'spent' | 'currentROI'>) => {
    const newMission: Mission = {
      ...missionData,
      id: `mission_${Date.now()}`,
      currentRevenue: 0,
      spent: 0,
      currentROI: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMissions(prev => [newMission, ...prev]);
    
    const audit: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Sarah Jenkins',
      actorType: 'USER',
      action: `Created Mission: ${newMission.name}`,
      entityType: 'MISSION',
      entityId: newMission.id,
      intent: 'Establish new revenue acceleration target',
      reason: newMission.description,
      evidence: [`Target: ₹${newMission.targetRevenue}, Budget: ₹${newMission.budget}`],
      status: 'SUCCESS',
      correlationId: `corr_mis_${Date.now()}`,
      tag: 'User Action'
    };
    setAuditEvents(prev => [audit, ...prev]);
  }, []);

  const updateMission = useCallback((id: string, updates: Partial<Mission>) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m));
  }, []);

  const pauseMission = useCallback((id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'PAUSED', updatedAt: new Date().toISOString() } : m));
  }, []);

  const resumeMission = useCallback((id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'RUNNING', updatedAt: new Date().toISOString() } : m));
  }, []);

  const stopMission = useCallback((id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'STOPPED', updatedAt: new Date().toISOString() } : m));
  }, []);

  // Campaign management
  const stopCampaign = useCallback((campaignId: string, reason?: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          status: 'STOPPED',
          stoppedReason: reason || 'Manually stopped by operator'
        };
      }
      return c;
    }));

    const audit: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Human Operator',
      actorType: 'USER',
      action: `Campaign Halted: ${campaignId}`,
      entityType: 'CAMPAIGN',
      entityId: campaignId,
      intent: 'Stop outbound ad campaign deployment',
      reason: reason || 'Halted underperforming or completed campaign.',
      evidence: ['Manual button trigger: Stop Campaign'],
      status: 'WARNING',
      correlationId: `corr_camp_${Date.now()}`,
      tag: 'User Action'
    };
    setAuditEvents(prev => [audit, ...prev]);
  }, []);

  // Transactions & Gateway
  const createManualTransaction = useCallback(async (amount: number, customerName: string, action: string): Promise<Transaction> => {
    const timestamp = new Date().toISOString();
    const order = await RazorpaySimulator.createOrder({
      amount: amount * 100,
      currency: 'INR',
      notes: { customer: customerName, action }
    });

    const txn: Transaction = {
      id: `tx_${Date.now().toString(36).toUpperCase()}`,
      razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 8)}`,
      razorpayOrderId: order.id,
      amount,
      currency: 'INR',
      status: 'SUCCESS',
      action,
      customer: {
        id: `cust_${Math.floor(Math.random() * 900) + 100}`,
        name: customerName,
        email: `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`
      },
      missionId: activeMission.id,
      agentId: 'Revenue-Agent',
      policyApplied: 'Direct Capture',
      createdAt: timestamp,
      source: 'ORGANIC',
      executionTrail: [
        {
          id: 'st_1',
          name: 'Manual Order Initiated',
          timestamp: new Date().toLocaleTimeString(),
          status: 'SUCCESS',
          description: `Processed payment of ₹${amount} for ${customerName}`
        }
      ]
    };

    setTransactions(prev => [txn, ...prev]);

    // Update mission revenue
    setMissions(prev => prev.map(m => {
      if (m.id === activeMission.id) {
        const newRev = m.currentRevenue + amount;
        const currentROI = m.spent > 0 ? Number((newRev / m.spent).toFixed(2)) : 0;
        return {
          ...m,
          currentRevenue: newRev,
          currentROI,
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    }));

    return txn;
  }, [activeMission]);

  const refundTransaction = useCallback(async (transactionId: string, reason?: string) => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn) return;

    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        const updatedSteps = [
          ...(t.executionTrail || []),
          {
            id: `st_ref_${Date.now()}`,
            name: 'Refund Completed',
            timestamp: new Date().toLocaleTimeString(),
            status: 'SUCCESS' as const,
            description: `Refund of ₹${t.amount} issued. Reason: ${reason || 'Operator requested refund'}`
          }
        ];
        return {
          ...t,
          status: 'REFUNDED',
          executionTrail: updatedSteps
        };
      }
      return t;
    }));

    const audit: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Sarah Jenkins',
      actorType: 'USER',
      action: `Refund Executed: ₹${txn.amount}`,
      entityType: 'TRANSACTION',
      entityId: txn.id,
      intent: 'Refund customer payment via Razorpay Gateway',
      reason: reason || 'Customer satisfaction policy override.',
      evidence: [`Transaction ID: ${txn.id}`, `Gateway Ref: ${txn.razorpayPaymentId}`],
      status: 'SUCCESS',
      correlationId: `corr_${txn.id}`,
      amount: txn.amount,
      tag: 'Execution'
    };
    setAuditEvents(prev => [audit, ...prev]);

    // Adjust revenue
    setMissions(prev => prev.map(m => {
      if (m.id === activeMission.id) {
        const newRev = Math.max(0, m.currentRevenue - txn.amount);
        const currentROI = m.spent > 0 ? Number((newRev / m.spent).toFixed(2)) : 0;
        return {
          ...m,
          currentRevenue: newRev,
          currentROI,
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    }));
  }, [transactions, activeMission]);

  // Live order simulation
  const simulateCustomerOrder = useCallback(async (type: 'coffee' | 'sandwich' | 'combo' | 'family'): Promise<Transaction> => {
    const productMap = {
      coffee: { name: 'Artisan Pour-over Coffee', amount: 180 },
      sandwich: { name: 'Gourmet Panini Sandwich', amount: 250 },
      combo: { name: 'Coffee + Sandwich Lunch Combo', amount: 399 },
      family: { name: 'Deluxe Weekend Family Meal', amount: 599 }
    };

    const item = productMap[type];
    const customerNames = ['Aarav Patel', 'Meera Rao', 'Vikramaditya Sengupta', 'Deepika Nair', 'Rishi Kulkarni', 'Neha Gupta'];
    const selectedCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];

    const rzpOrder = await RazorpaySimulator.createOrder({
      amount: item.amount * 100,
      currency: 'INR',
      notes: { item: item.name, customer: selectedCustomer }
    });

    const timestamp = new Date().toISOString();
    const txn: Transaction = {
      id: `tx_${Date.now().toString(36).toUpperCase()}`,
      razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 8)}`,
      razorpayOrderId: rzpOrder.id,
      amount: item.amount,
      currency: 'INR',
      status: 'SUCCESS',
      action: item.name,
      customer: {
        id: `cust_${Math.floor(Math.random() * 800) + 200}`,
        name: selectedCustomer,
        email: `${selectedCustomer.toLowerCase().replace(/\s+/g, '.')}@gmail.com`
      },
      missionId: activeMission.id,
      campaignId: 'camp_02',
      agentId: 'Revenue-Agent',
      policyApplied: 'Autonomous Checkout',
      createdAt: timestamp,
      source: 'RECOVERED',
      executionTrail: [
        {
          id: 'st_1',
          name: 'Cart Recovery Nudge Sent',
          timestamp: new Date(Date.now() - 5000).toLocaleTimeString(),
          status: 'SUCCESS',
          description: `SMS discount link dispatched for ${item.name}`
        },
        {
          id: 'st_2',
          name: 'Razorpay Checkout Verified',
          timestamp: new Date().toLocaleTimeString(),
          status: 'SUCCESS',
          description: `Captured ₹${item.amount} via UPI. Order ID: ${rzpOrder.id}`
        }
      ]
    };

    setTransactions(prev => [txn, ...prev]);

    // Update mission revenue & campaign stats
    setMissions(prev => prev.map(m => {
      if (m.id === activeMission.id) {
        const newRev = m.currentRevenue + item.amount;
        const currentROI = m.spent > 0 ? Number((newRev / m.spent).toFixed(2)) : 0;
        return {
          ...m,
          currentRevenue: newRev,
          currentROI,
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    }));

    setCampaigns(prev => prev.map(c => {
      if (c.id === 'camp_02') {
        const newRev = c.revenueGenerated + item.amount;
        const actualROI = c.budgetSpent > 0 ? Number((newRev / c.budgetSpent).toFixed(2)) : 7.3;
        return {
          ...c,
          revenueGenerated: newRev,
          actualROI
        };
      }
      return c;
    }));

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: 'New Revenue Converted',
        message: `${selectedCustomer} purchased ${item.name} (₹${item.amount}) via autonomous recovery link.`,
        type: 'PAYMENT_SUCCESS',
        timestamp: new Date().toISOString(),
        read: false,
        linkTo: '/transactions',
        entityId: txn.id
      },
      ...prev
    ]);

    return txn;
  }, [activeMission]);

  // Failure simulation
  const simulateFailure = useCallback(async (scenario: 'budget_limit' | 'low_roi' | 'unrecognized_vendor' | 'agent_paused'): Promise<AgentDecision> => {
    let templateIdx = 0;
    if (scenario === 'budget_limit') templateIdx = 3; // High spend
    if (scenario === 'low_roi') templateIdx = 4; // Low ROI
    if (scenario === 'unrecognized_vendor') templateIdx = 3;

    const decision = await AgentService.formulateDecision(activeMission, policies, agent, templateIdx);

    if (scenario === 'agent_paused') {
      decision.policyEvaluation = {
        allowed: false,
        requiresApproval: false,
        reason: 'Agent is currently in PAUSED operating mode. All autonomous capital deployment is blocked.',
        checks: [
          {
            policyId: 'agent_status',
            policyName: 'Agent Operating State',
            passed: false,
            message: 'Agent status is PAUSED'
          }
        ]
      };
      decision.decisionStatus = 'BLOCKED';
      decision.executionStatus = 'FAILED';
    }

    setDecisions(prev => [decision, ...prev]);

    const audit: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Policy Engine',
      actorType: 'POLICY_ENGINE',
      action: `Guardrail Evaluation: ${decision.proposedAction.title}`,
      entityType: 'DECISION',
      entityId: decision.id,
      intent: decision.intent,
      reason: decision.policyEvaluation.reason,
      evidence: decision.evidence,
      policyChecks: decision.policyEvaluation.checks,
      status: decision.policyEvaluation.allowed ? 'WARNING' : 'BLOCKED',
      correlationId: `corr_sim_${Date.now()}`,
      amount: decision.proposedAction.amount,
      tag: 'Escalation'
    };
    setAuditEvents(prev => [audit, ...prev]);

    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: 'Guardrail Enforcement Simulated',
        message: `Scenario '${scenario}' triggered. Result: ${decision.decisionStatus} - ${decision.policyEvaluation.reason}`,
        type: 'POLICY_VIOLATION',
        timestamp: new Date().toISOString(),
        read: false,
        linkTo: '/policies',
        entityId: decision.id
      },
      ...prev
    ]);

    return decision;
  }, [activeMission, policies, agent]);

  const updateRazorpayConfig = useCallback((config: Partial<RazorpayConfig>) => {
    setRazorpayConfig(prev => ({ ...prev, ...config }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const resetDemoData = useCallback(() => {
    StorageRepository.resetAll();
    window.location.reload();
  }, []);

  return (
    <AppContext.Provider
      value={{
        merchant,
        agent,
        missions,
        activeMission,
        policies,
        campaigns,
        decisions,
        transactions,
        auditEvents,
        notifications,
        razorpayConfig,
        activeTab,
        searchQuery,
        isProcessingCycle,
        liveFeedTicker,
        setActiveTab,
        setSearchQuery,
        selectMission,
        pauseAgent,
        resumeAgent,
        emergencyStopAgent,
        setAgentAutonomy,
        runAgentCycle,
        createMission,
        updateMission,
        pauseMission,
        resumeMission,
        stopMission,
        approveDecision,
        rejectDecision,
        modifyAndApproveDecision,
        updatePolicy,
        togglePolicy,
        createManualTransaction,
        refundTransaction,
        stopCampaign,
        simulateCustomerOrder,
        simulateFailure,
        updateRazorpayConfig,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
