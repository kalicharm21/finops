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
  RazorpayConfig
} from '../../types';
import {
  initialMerchant,
  initialAgent,
  initialMissions,
  initialPolicies,
  initialCampaigns,
  initialDecisions,
  initialTransactions,
  initialAuditEvents,
  initialNotifications,
  initialRazorpayConfig
} from './seedData';

const STORAGE_KEYS = {
  MERCHANT: 'finops_merchant',
  AGENT: 'finops_agent',
  MISSIONS: 'finops_missions',
  POLICIES: 'finops_policies',
  CAMPAIGNS: 'finops_campaigns',
  DECISIONS: 'finops_decisions',
  TRANSACTIONS: 'finops_transactions',
  AUDIT_EVENTS: 'finops_audit_events',
  NOTIFICATIONS: 'finops_notifications',
  RAZORPAY_CONFIG: 'finops_razorpay_config'
};

function getStorage<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return defaultVal;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage`, e);
  }
}

export class StorageRepository {
  // Merchant
  static getMerchant(): Merchant {
    return getStorage(STORAGE_KEYS.MERCHANT, initialMerchant);
  }
  static saveMerchant(merchant: Merchant): void {
    setStorage(STORAGE_KEYS.MERCHANT, merchant);
  }

  // Agent
  static getAgent(): Agent {
    return getStorage(STORAGE_KEYS.AGENT, initialAgent);
  }
  static saveAgent(agent: Agent): void {
    setStorage(STORAGE_KEYS.AGENT, agent);
  }

  // Missions
  static getMissions(): Mission[] {
    return getStorage(STORAGE_KEYS.MISSIONS, initialMissions);
  }
  static getMissionById(id: string): Mission | undefined {
    return this.getMissions().find(m => m.id === id);
  }
  static saveMissions(missions: Mission[]): void {
    setStorage(STORAGE_KEYS.MISSIONS, missions);
  }
  static upsertMission(mission: Mission): void {
    const list = this.getMissions();
    const idx = list.findIndex(m => m.id === mission.id);
    if (idx >= 0) {
      list[idx] = mission;
    } else {
      list.unshift(mission);
    }
    this.saveMissions(list);
  }

  // Policies
  static getPolicies(): Policy[] {
    return getStorage(STORAGE_KEYS.POLICIES, initialPolicies);
  }
  static savePolicies(policies: Policy[]): void {
    setStorage(STORAGE_KEYS.POLICIES, policies);
  }
  static updatePolicy(id: string, updates: Partial<Policy>): Policy | null {
    const list = this.getPolicies();
    const idx = list.findIndex(p => p.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
      this.savePolicies(list);
      return list[idx];
    }
    return null;
  }

  // Campaigns
  static getCampaigns(): Campaign[] {
    return getStorage(STORAGE_KEYS.CAMPAIGNS, initialCampaigns);
  }
  static saveCampaigns(campaigns: Campaign[]): void {
    setStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
  }
  static upsertCampaign(campaign: Campaign): void {
    const list = this.getCampaigns();
    const idx = list.findIndex(c => c.id === campaign.id);
    if (idx >= 0) {
      list[idx] = campaign;
    } else {
      list.unshift(campaign);
    }
    this.saveCampaigns(list);
  }

  // Decisions
  static getDecisions(): AgentDecision[] {
    return getStorage(STORAGE_KEYS.DECISIONS, initialDecisions);
  }
  static saveDecisions(decisions: AgentDecision[]): void {
    setStorage(STORAGE_KEYS.DECISIONS, decisions);
  }
  static upsertDecision(decision: AgentDecision): void {
    const list = this.getDecisions();
    const idx = list.findIndex(d => d.id === decision.id);
    if (idx >= 0) {
      list[idx] = decision;
    } else {
      list.unshift(decision);
    }
    this.saveDecisions(list);
  }

  // Transactions
  static getTransactions(): Transaction[] {
    return getStorage(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
  }
  static saveTransactions(transactions: Transaction[]): void {
    setStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  }
  static addTransaction(transaction: Transaction): void {
    const list = this.getTransactions();
    list.unshift(transaction);
    this.saveTransactions(list);
  }

  // Audit Events
  static getAuditEvents(): AuditEvent[] {
    return getStorage(STORAGE_KEYS.AUDIT_EVENTS, initialAuditEvents);
  }
  static saveAuditEvents(events: AuditEvent[]): void {
    setStorage(STORAGE_KEYS.AUDIT_EVENTS, events);
  }
  static logAuditEvent(event: AuditEvent): void {
    const list = this.getAuditEvents();
    list.unshift(event);
    this.saveAuditEvents(list);
  }

  // Notifications
  static getNotifications(): Notification[] {
    return getStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }
  static saveNotifications(notifications: Notification[]): void {
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
  static addNotification(notification: Notification): void {
    const list = this.getNotifications();
    list.unshift(notification);
    this.saveNotifications(list);
  }

  // Razorpay Config
  static getRazorpayConfig(): RazorpayConfig {
    return getStorage(STORAGE_KEYS.RAZORPAY_CONFIG, initialRazorpayConfig);
  }
  static saveRazorpayConfig(config: RazorpayConfig): void {
    setStorage(STORAGE_KEYS.RAZORPAY_CONFIG, config);
  }

  // Reset demo data
  static resetAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.MERCHANT);
    localStorage.removeItem(STORAGE_KEYS.AGENT);
    localStorage.removeItem(STORAGE_KEYS.MISSIONS);
    localStorage.removeItem(STORAGE_KEYS.POLICIES);
    localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEYS.DECISIONS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_EVENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.RAZORPAY_CONFIG);
  }
}
