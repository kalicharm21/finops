export type Currency = 'INR' | 'USD' | 'EUR';

export interface Merchant {
  id: string;
  name: string;
  currency: Currency;
  currencySymbol: string;
  environment: 'test' | 'live';
  createdAt: string;
  category: string;
  monthlyBaselineRevenue: number;
}

export type MissionStatus = 
  | 'DRAFT' 
  | 'SCHEDULED' 
  | 'RUNNING' 
  | 'PAUSED' 
  | 'COMPLETED' 
  | 'STOPPED' 
  | 'FAILED';

export interface Mission {
  id: string;
  name: string;
  description: string;
  goalType: 'REVENUE_TARGET' | 'USER_ACQUISITION' | 'CONVERSION_RECOVERY' | 'RETENTION';
  targetRevenue: number;
  currentRevenue: number;
  budget: number;
  spent: number;
  minimumROI: number; // e.g. 2.0 (2x)
  maximumSingleTransaction: number; // e.g. 1500
  stopLoss: number; // e.g. 1000
  approvalThreshold: number; // e.g. 1500
  status: MissionStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  projectedROI?: number;
  currentROI?: number;
}

export type AgentStatus = 'ONLINE' | 'PAUSED' | 'STOPPED' | 'ERROR';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  autonomyLevel: number; // 0 to 100
  currentMissionId: string | null;
  lastDecisionAt: string;
  eventsProcessed: number;
  actionsToday: number;
  blockedActions: number;
  policyCompliance: number; // percentage, e.g. 97.4
  throughputEventsPerMin: number;
  activeTasksCount: number;
  memoryInsights: AgentMemoryItem[];
}

export interface AgentMemoryItem {
  id: string;
  type: 'INSIGHT' | 'WARNING' | 'OPTIMIZATION';
  title: string;
  description: string;
  timestamp: string;
  category: string;
}

export type DecisionStatus = 
  | 'PROPOSED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'BLOCKED' 
  | 'EXECUTED' 
  | 'FAILED' 
  | 'EXPIRED';

export type ActionType = 
  | 'CREATE_CAMPAIGN' 
  | 'GENERATE_PAYMENT_LINK' 
  | 'REFUND_TRANSACTION' 
  | 'REALLOCATE_BUDGET' 
  | 'ADJUST_FX_HEDGE' 
  | 'STOP_UNDERPERFORMING_CAMPAIGN';

export interface ProposedAction {
  type: ActionType;
  title: string;
  amount: number;
  recipient?: string;
  vendor?: string;
  channel?: string;
  details?: Record<string, any>;
}

export interface PolicyCheckResult {
  policyId: string;
  policyName: string;
  passed: boolean;
  requiresApproval?: boolean;
  message: string;
  threshold?: number;
  actual?: number;
}

export interface PolicyEvaluation {
  allowed: boolean;
  requiresApproval: boolean;
  reason: string;
  checks: PolicyCheckResult[];
}

export interface AgentDecision {
  id: string;
  missionId: string;
  timestamp: string;
  intent: string;
  observation: string;
  hypothesis: string;
  proposedAction: ProposedAction;
  expectedRevenue: number;
  expectedCost: number;
  expectedROI: number;
  confidence: number; // 0 to 1
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence: string[];
  policyEvaluation: PolicyEvaluation;
  decisionStatus: DecisionStatus;
  executionStatus: 'NOT_STARTED' | 'PENDING' | 'EXECUTED' | 'FAILED' | 'ROLLED_BACK';
  outcome?: {
    revenueCaptured?: number;
    actualROI?: number;
    notes?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  };
  reviewer?: {
    id: string;
    name: string;
    timestamp: string;
    comment?: string;
  };
  groqMetadata?: {
    model: string;
    latencyMs?: number;
    hardware?: string;
    liveApi?: boolean;
    reasoningTrace?: string;
  };
}

export type PolicyType = 
  | 'DAILY_SPEND_LIMIT' 
  | 'SINGLE_TRANSACTION_LIMIT' 
  | 'MINIMUM_ROI' 
  | 'STOP_LOSS' 
  | 'APPROVAL_THRESHOLD' 
  | 'MISSION_BUDGET'
  | 'GEO_FENCING'
  | 'UNRECOGNIZED_VENDORS';

export interface Policy {
  id: string;
  name: string;
  type: PolicyType;
  category: 'Limits' | 'Performance' | 'Security' | 'Governance';
  value: number | string;
  formattedValue: string;
  unit: string;
  enabled: boolean;
  severity: 'BLOCK' | 'REQUIRE_APPROVAL' | 'WARN';
  description: string;
  isAiManaged?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = 
  | 'CREATED' 
  | 'PENDING' 
  | 'SUCCESS' 
  | 'FAILED' 
  | 'REFUNDED' 
  | 'BLOCKED';

export interface TransactionStep {
  id: string;
  name: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  description: string;
  codeSnippet?: string;
}

export interface Transaction {
  id: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  action: string;
  customer: {
    id: string;
    name: string;
    email?: string;
  };
  missionId?: string;
  campaignId?: string;
  agentId: string;
  policyApplied: string;
  createdAt: string;
  source: 'AGENT_PROPOSED' | 'ORGANIC' | 'RECOVERED' | 'MANUAL';
  executionTrail?: TransactionStep[];
  receiptUrl?: string;
  metadata?: Record<string, any>;
}

export type CampaignStatus = 
  | 'ACTIVE' 
  | 'SCHEDULED' 
  | 'PAUSED' 
  | 'COMPLETED' 
  | 'UNDERPERFORMING' 
  | 'STOPPED';

export interface Campaign {
  id: string;
  missionId: string;
  name: string;
  status: CampaignStatus;
  totalSent: number;
  conversionRate: number; // e.g. 15.2%
  revenueGenerated: number;
  budgetAllocated: number;
  budgetSpent: number;
  actualROI: number;
  targetROI: number;
  targetAudience: string;
  channel: string;
  createdAt: string;
  stoppedReason?: string;
}

export type ActorType = 'AGENT' | 'USER' | 'SYSTEM' | 'POLICY_ENGINE' | 'RAZORPAY';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorType: ActorType;
  action: string;
  entityType: 'MISSION' | 'TRANSACTION' | 'POLICY' | 'DECISION' | 'CAMPAIGN' | 'AGENT' | 'INTEGRATION';
  entityId: string;
  intent: string;
  reason: string;
  evidence: string[];
  policyChecks?: PolicyCheckResult[];
  requestData?: Record<string, any>;
  responseData?: Record<string, any>;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'BLOCKED' | 'ESCALATED';
  correlationId: string;
  amount?: number;
  tag?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'APPROVAL_REQUIRED' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'CAMPAIGN_STOPPED' | 'POLICY_VIOLATION' | 'AGENT_PAUSED' | 'MISSION_COMPLETED';
  timestamp: string;
  read: boolean;
  linkTo: string;
  entityId?: string;
}

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  testMode: boolean;
  isConnected: boolean;
  merchantId: string;
}
