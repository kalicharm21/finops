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

export const initialMerchant: Merchant = {
  id: 'merchant_shio',
  name: 'Shio Café',
  currency: 'INR',
  currencySymbol: '₹',
  environment: 'test',
  createdAt: '2023-01-15T00:00:00.000Z',
  category: 'Food & Beverage',
  monthlyBaselineRevenue: 9680
};

export const initialAgent: Agent = {
  id: 'agent_core_01',
  name: 'FinOps AI Engine v2.4',
  status: 'ONLINE',
  autonomyLevel: 75,
  currentMissionId: 'mission_revenue_sprint_01',
  lastDecisionAt: '2023-10-24T14:30:00.000Z',
  eventsProcessed: 1842,
  actionsToday: 42,
  blockedActions: 3,
  policyCompliance: 97.4,
  throughputEventsPerMin: 1800,
  activeTasksCount: 42,
  memoryInsights: [
    {
      id: 'mem_1',
      type: 'INSIGHT',
      title: 'Friday campaigns',
      description: 'Friday campaigns consistently outperform Monday launches by 18% in the F&B sector.',
      timestamp: '2023-10-24T12:00:00.000Z',
      category: 'Campaign Optimization'
    },
    {
      id: 'mem_2',
      type: 'WARNING',
      title: 'Weekend Velocity',
      description: 'Detected slight anomaly in weekend transaction velocity for Tier 2 cities. Adjusting risk threshold.',
      timestamp: '2023-10-24T10:15:00.000Z',
      category: 'Risk Management'
    },
    {
      id: 'mem_3',
      type: 'OPTIMIZATION',
      title: 'API Latency',
      description: 'Optimized routing for API endpoint /v2/payments resulting in 12ms latency reduction.',
      timestamp: '2023-10-23T18:40:00.000Z',
      category: 'Infrastructure'
    }
  ]
};

export const initialMissions: Mission[] = [
  {
    id: 'mission_revenue_sprint_01',
    name: 'Revenue Sprint',
    description: 'Autonomous multi-channel revenue acceleration for Q4 with real-time conversion and bundle optimization.',
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
    startDate: '2023-10-01T00:00:00.000Z',
    endDate: '2023-10-31T23:59:59.000Z',
    createdAt: '2023-10-01T08:00:00.000Z',
    updatedAt: '2023-10-24T14:32:00.000Z',
    projectedROI: 5.4,
    currentROI: 5.41
  },
  {
    id: 'mission_weekend_growth_02',
    name: 'Weekend Growth',
    description: 'Drive high-volume new customer acquisitions over high-traffic weekend lunch periods.',
    goalType: 'USER_ACQUISITION',
    targetRevenue: 35000,
    currentRevenue: 0,
    budget: 12500,
    spent: 0,
    minimumROI: 1.8,
    maximumSingleTransaction: 2500,
    stopLoss: 2000,
    approvalThreshold: 2000,
    status: 'SCHEDULED',
    startDate: '2023-10-28T00:00:00.000Z',
    endDate: '2023-11-05T23:59:59.000Z',
    createdAt: '2023-10-20T10:00:00.000Z',
    updatedAt: '2023-10-20T10:00:00.000Z',
    projectedROI: 1.8,
    currentROI: 0
  },
  {
    id: 'mission_checkout_recovery_03',
    name: 'Checkout Recovery',
    description: 'Dynamic discount nudges and automated checkout recovery links for high-intent abandoned carts.',
    goalType: 'CONVERSION_RECOVERY',
    targetRevenue: 15000,
    currentRevenue: 6800,
    budget: 10000,
    spent: 8200,
    minimumROI: 1.5,
    maximumSingleTransaction: 1200,
    stopLoss: 1500,
    approvalThreshold: 1500,
    status: 'PAUSED',
    startDate: '2023-09-15T00:00:00.000Z',
    endDate: '2023-10-20T23:59:59.000Z',
    createdAt: '2023-09-15T09:00:00.000Z',
    updatedAt: '2023-10-22T11:00:00.000Z',
    projectedROI: 1.5,
    currentROI: 1.1
  }
];

export const initialPolicies: Policy[] = [
  {
    id: 'pol_daily_spend',
    name: 'Max Daily Spend',
    type: 'DAILY_SPEND_LIMIT',
    category: 'Limits',
    value: 2000,
    formattedValue: '₹2,000.00',
    unit: 'INR',
    enabled: true,
    severity: 'BLOCK',
    description: 'Hard cap on total autonomous capital deployed across all campaigns in a single 24-hour cycle.',
    isAiManaged: false,
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2023-10-20T00:00:00.000Z'
  },
  {
    id: 'pol_max_single_txn',
    name: 'Max Single Txn',
    type: 'SINGLE_TRANSACTION_LIMIT',
    category: 'Limits',
    value: 1500,
    formattedValue: '₹1,500.00',
    unit: 'INR',
    enabled: true,
    severity: 'REQUIRE_APPROVAL',
    description: 'Single transactions exceeding ₹1,500 require manual human approval in the Approvals Queue.',
    isAiManaged: false,
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2023-10-20T00:00:00.000Z'
  },
  {
    id: 'pol_min_roi',
    name: 'Min ROI Threshold',
    type: 'MINIMUM_ROI',
    category: 'Performance',
    value: 2.0,
    formattedValue: '2.0x',
    unit: 'x',
    enabled: true,
    severity: 'BLOCK',
    description: 'Target multiplier for campaign expected return. Actions with estimated ROI below this limit are rejected.',
    isAiManaged: true,
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2023-10-22T00:00:00.000Z'
  },
  {
    id: 'pol_geofencing',
    name: 'Geo-Fencing',
    type: 'GEO_FENCING',
    category: 'Security',
    value: 'Restricted',
    formattedValue: 'Restricted (IN only)',
    unit: 'Region',
    enabled: false,
    severity: 'BLOCK',
    description: 'Restricts automated payment links and outbound payouts strictly to whitelisted domestic regions.',
    isAiManaged: false,
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2023-10-20T00:00:00.000Z'
  },
  {
    id: 'pol_unrecognized_vendors',
    name: 'Unrecognized Vendors',
    type: 'UNRECOGNIZED_VENDORS',
    category: 'Security',
    value: 'Review All',
    formattedValue: 'Always Review',
    unit: 'Status',
    enabled: true,
    severity: 'REQUIRE_APPROVAL',
    description: 'Any payout to an unrecognized merchant, vendor or external beneficiary requires explicit review.',
    isAiManaged: false,
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2023-10-20T00:00:00.000Z'
  },
  {
    id: 'pol_stop_loss',
    name: 'Stop Loss Guardrail',
    type: 'STOP_LOSS',
    category: 'Governance',
    value: 1000,
    formattedValue: '₹1,000.00',
    unit: 'INR',
    enabled: true,
    severity: 'BLOCK',
    description: 'Automatically halts underperforming campaigns if cumulative loss exceeds the threshold.',
    isAiManaged: true,
    createdAt: '2023-09-01T00:00:00.000Z',
    updatedAt: '2023-10-20T00:00:00.000Z'
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: 'camp_01',
    missionId: 'mission_revenue_sprint_01',
    name: 'Q3 Re-engagement',
    status: 'ACTIVE',
    totalSent: 4520,
    conversionRate: 8.4,
    revenueGenerated: 4250,
    budgetAllocated: 1200,
    budgetSpent: 850,
    actualROI: 5.0,
    targetROI: 3.5,
    targetAudience: 'Inactive customers (30+ days)',
    channel: 'WhatsApp + SMS',
    createdAt: '2023-10-05T10:00:00.000Z'
  },
  {
    id: 'camp_02',
    missionId: 'mission_revenue_sprint_01',
    name: 'Abandoned Cart Nudge',
    status: 'ACTIVE',
    totalSent: 1205,
    conversionRate: 15.2,
    revenueGenerated: 6800,
    budgetAllocated: 1000,
    budgetSpent: 930,
    actualROI: 7.31,
    targetROI: 4.0,
    targetAudience: 'Cart value > ₹500, dropped at payment',
    channel: 'Dynamic Razorpay Payment Links',
    createdAt: '2023-10-10T14:00:00.000Z'
  },
  {
    id: 'camp_03',
    missionId: 'mission_revenue_sprint_01',
    name: 'Welcome Series Upsell',
    status: 'COMPLETED',
    totalSent: 8900,
    conversionRate: 3.1,
    revenueGenerated: 2370,
    budgetAllocated: 800,
    budgetSpent: 700,
    actualROI: 3.38,
    targetROI: 2.5,
    targetAudience: 'First-time purchasers',
    channel: 'Email + In-app Notification',
    createdAt: '2023-10-01T08:00:00.000Z'
  },
  {
    id: 'camp_04',
    missionId: 'mission_revenue_sprint_01',
    name: 'Weekend Flash Discount',
    status: 'PAUSED',
    totalSent: 3100,
    conversionRate: 6.2,
    revenueGenerated: 1800,
    budgetAllocated: 1500,
    budgetSpent: 1200,
    actualROI: 1.5,
    targetROI: 2.5,
    targetAudience: 'Lunch-time repeat visitors',
    channel: 'SMS Blast',
    createdAt: '2023-10-14T11:00:00.000Z'
  }
];

export const initialDecisions: AgentDecision[] = [
  {
    id: 'dec_current_01',
    missionId: 'mission_revenue_sprint_01',
    timestamp: '2023-10-24T14:30:00.000Z',
    intent: 'Promote ₹399 combo meal to lunch crowd to boost mid-day basket size',
    observation: 'Lunch basket size average is currently ₹210 with 14% sandwich attachment. Friday lunch traffic shows a 28% increase in order volume.',
    hypothesis: 'Launching a targeted ₹399 Coffee + Sandwich bundle campaign with an incentive coupon will lift AOV to ₹390 and convert ~120 lunch customers.',
    proposedAction: {
      type: 'CREATE_CAMPAIGN',
      title: 'Launch ₹399 Coffee + Sandwich campaign',
      amount: 700,
      channel: 'WhatsApp + Payment Links',
      details: {
        bundlePrice: 399,
        items: ['Artisan Coffee', 'Gourmet Panini Sandwich'],
        targetUsers: 1400,
        couponCode: 'COMBO399'
      }
    },
    expectedRevenue: 4800,
    expectedCost: 700,
    expectedROI: 5.8,
    confidence: 0.91,
    riskLevel: 'LOW',
    evidence: [
      'Historical Friday lunch order volume +28%',
      'Sandwich standalone attach rate 14% vs 42% benchmark',
      'Average order value increase projection +₹180/order',
      'Customer appetite survey index: 88/100'
    ],
    policyEvaluation: {
      allowed: true,
      requiresApproval: false,
      reason: 'All active policy checks passed. Estimated ROI 5.8x exceeds 2.0x minimum; proposed cost ₹700 is within single transaction limit ₹1,500 and available mission budget ₹2,520.',
      checks: [
        { policyId: 'pol_daily_spend', policyName: 'Max Daily Spend', passed: true, message: 'Within remaining daily budget allowance.' },
        { policyId: 'pol_max_single_txn', policyName: 'Max Single Txn', passed: true, message: 'Proposed ₹700 <= ₹1,500 limit.' },
        { policyId: 'pol_min_roi', policyName: 'Min ROI Threshold', passed: true, message: 'Expected ROI 5.8x >= 2.0x target.' },
        { policyId: 'pol_stop_loss', policyName: 'Stop Loss Guardrail', passed: true, message: 'No negative stop loss breach detected.' }
      ]
    },
    decisionStatus: 'PROPOSED',
    executionStatus: 'NOT_STARTED'
  },
  {
    id: 'dec_pending_02',
    missionId: 'mission_revenue_sprint_01',
    timestamp: '2023-10-24T13:10:00.000Z',
    intent: 'Deploy programmatic AdTech expansion across local food discovery channels',
    observation: 'AdTech Solutions programmatic inventory offers 40% discount for Q4 early-booking slots.',
    hypothesis: 'Securing ad inventory will generate ₹7,030 in incremental weekend bookings.',
    proposedAction: {
      type: 'CREATE_CAMPAIGN',
      title: 'Agent requests ₹1,850 for AdTech marketing slot',
      amount: 1850,
      vendor: 'AdTech Solutions',
      channel: 'Local Food Ads',
      details: {
        category: 'Marketing Spends',
        agentId: 'MKT-BOT-04'
      }
    },
    expectedRevenue: 7030,
    expectedCost: 1850,
    expectedROI: 3.8,
    confidence: 0.84,
    riskLevel: 'LOW',
    evidence: [
      'AdTech network conversion rate 4.2% historically',
      'Inventory cost ₹1,850 exceeds autonomous threshold ₹1,500',
      'Estimated impressions: 45,000 local foodies'
    ],
    policyEvaluation: {
      allowed: true,
      requiresApproval: true,
      reason: 'This automated transaction requires manual review because the requested amount ₹1,850 exceeds the configured single transaction threshold of ₹1,500 for the \'Marketing Spends\' category.',
      checks: [
        { policyId: 'pol_max_single_txn', policyName: 'Max Single Txn', passed: false, requiresApproval: true, message: 'Requested amount ₹1,850 exceeds threshold ₹1,500.' },
        { policyId: 'pol_min_roi', policyName: 'Min ROI Threshold', passed: true, message: 'Expected ROI 3.8x >= 2.0x target.' }
      ]
    },
    decisionStatus: 'PROPOSED',
    executionStatus: 'PENDING'
  },
  {
    id: 'dec_hist_03',
    missionId: 'mission_revenue_sprint_01',
    timestamp: '2023-10-24T14:30:00.000Z',
    intent: 'Cloud Infrastructure Server Capacity Upgrade',
    observation: 'Server CPU utilization spikes above 85% during lunch flash sales.',
    hypothesis: 'Auto-scaling infrastructure prevents checkout latency dropoffs.',
    proposedAction: {
      type: 'REALLOCATE_BUDGET',
      title: 'Cloud Infrastructure Bill',
      amount: 4200,
      vendor: 'CloudHost Services',
      details: { agentId: 'OPS-BOT-01' }
    },
    expectedRevenue: 15000,
    expectedCost: 4200,
    expectedROI: 3.57,
    confidence: 0.95,
    riskLevel: 'LOW',
    evidence: ['Server CPU metric log', 'Checkout latency correlation analysis'],
    policyEvaluation: {
      allowed: true,
      requiresApproval: true,
      reason: 'Approved by human reviewer Sarah Jenkins.',
      checks: [{ policyId: 'pol_max_single_txn', policyName: 'Max Single Txn', passed: true, message: 'Override granted.' }]
    },
    decisionStatus: 'APPROVED',
    executionStatus: 'EXECUTED',
    reviewer: { id: 'usr_sarah', name: 'Sarah Jenkins', timestamp: '2023-10-24T14:30:00.000Z' }
  },
  {
    id: 'dec_hist_04',
    missionId: 'mission_revenue_sprint_01',
    timestamp: '2023-10-24T11:15:00.000Z',
    intent: 'Unrecognized vendor payment for offshore analytics plugin',
    observation: 'External plugin vendor requested ₹850 subscription renewal.',
    hypothesis: 'Non-whitelisted third-party tool.',
    proposedAction: {
      type: 'REALLOCATE_BUDGET',
      title: 'Unrecognized Vendor Payment',
      amount: 850,
      vendor: 'Unknown Offshore Plugin',
      details: { agentId: 'FIN-BOT-02' }
    },
    expectedRevenue: 0,
    expectedCost: 850,
    expectedROI: 0,
    confidence: 0.4,
    riskLevel: 'HIGH',
    evidence: ['Vendor domain not on verified whitelist'],
    policyEvaluation: {
      allowed: false,
      requiresApproval: true,
      reason: 'Vendor not in approved directory. High risk assessment.',
      checks: [{ policyId: 'pol_unrecognized_vendors', policyName: 'Unrecognized Vendors', passed: false, message: 'Vendor failed trust check.' }]
    },
    decisionStatus: 'REJECTED',
    executionStatus: 'FAILED',
    reviewer: { id: 'usr_sarah', name: 'Sarah Jenkins', timestamp: '2023-10-24T11:15:00.000Z', comment: 'Rejected unverified vendor payment.' }
  },
  {
    id: 'dec_hist_05',
    missionId: 'mission_revenue_sprint_01',
    timestamp: '2023-10-23T16:45:00.000Z',
    intent: 'SaaS Subscription Renewal for POS sync',
    observation: 'Monthly POS connector API license renewal due.',
    hypothesis: 'Required for real-time inventory and bill settlement.',
    proposedAction: {
      type: 'REALLOCATE_BUDGET',
      title: 'SaaS Subscription Renewal',
      amount: 1200,
      vendor: 'POS Direct Cloud',
      details: { agentId: 'OPS-BOT-01' }
    },
    expectedRevenue: 24000,
    expectedCost: 1200,
    expectedROI: 20.0,
    confidence: 0.99,
    riskLevel: 'LOW',
    evidence: ['Contract ID #POS-992'],
    policyEvaluation: {
      allowed: true,
      requiresApproval: false,
      reason: 'Within budget and vendor whitelisted.',
      checks: [{ policyId: 'pol_max_single_txn', policyName: 'Max Single Txn', passed: true, message: 'Passed.' }]
    },
    decisionStatus: 'APPROVED',
    executionStatus: 'EXECUTED',
    reviewer: { id: 'usr_mark', name: 'Mark Reyes', timestamp: '2023-10-23T16:45:00.000Z' }
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx_7829104AC',
    razorpayPaymentId: 'pay_Njq1V',
    razorpayOrderId: 'order_Njq1V_ord',
    amount: 1250,
    currency: 'INR',
    status: 'SUCCESS',
    action: 'Refund Process',
    customer: { id: 'cust_01', name: 'Alex Mercer', email: 'alex.mercer@example.com' },
    missionId: 'mission_revenue_sprint_01',
    agentId: 'CS-Bot',
    policyApplied: 'Standard Refund',
    createdAt: '2023-10-24T14:32:01.000Z',
    source: 'AGENT_PROPOSED',
    executionTrail: [
      { id: 'st_1', name: 'Agent Intent', timestamp: '14:31:55', status: 'SUCCESS', description: 'CS-Bot initiated refund based on customer request and valid return receipt.', codeSnippet: '{ "action": "refund", "amount": 1250, "reason": "damaged_goods" }' },
      { id: 'st_2', name: 'Policy Evaluation', timestamp: '14:31:56', status: 'SUCCESS', description: 'Evaluated against "Standard Refund" policy. Within 30-day limit. Amount < ₹5000.' },
      { id: 'st_3', name: 'Authorization', timestamp: '14:31:56', status: 'SUCCESS', description: 'Auto-approved by System Rules.' },
      { id: 'st_4', name: 'Gateway: Razorpay', timestamp: '14:31:58', status: 'INFO', description: 'API call to payment gateway.', codeSnippet: 'POST /v1/payments/pay_Njq1V/refund\n200 OK' },
      { id: 'st_5', name: 'Outcome: Success', timestamp: '14:32:01', status: 'SUCCESS', description: 'Funds successfully routed back to source.' }
    ]
  },
  {
    id: 'tx_7829103BB',
    razorpayPaymentId: 'pay_Njq8K',
    razorpayOrderId: 'order_Njq8K_ord',
    amount: 45000,
    currency: 'INR',
    status: 'BLOCKED',
    action: 'Invoice Payment',
    customer: { id: 'cust_02', name: 'TechCorp Inc.', email: 'billing@techcorp.io' },
    missionId: 'mission_revenue_sprint_01',
    agentId: 'B2B-Agent',
    policyApplied: 'High Value Block',
    createdAt: '2023-10-24T14:15:22.000Z',
    source: 'AGENT_PROPOSED',
    executionTrail: [
      { id: 'st_1', name: 'Agent Intent', timestamp: '14:15:20', status: 'SUCCESS', description: 'B2B-Agent proposed payout for corporate catering invoice.' },
      { id: 'st_2', name: 'Policy Evaluation', timestamp: '14:15:21', status: 'ERROR', description: 'Blocked: Exceeds maximum autonomous transaction limit ₹1,500.' },
      { id: 'st_3', name: 'Escalation', timestamp: '14:15:22', status: 'WARNING', description: 'Sent to Human Approvals Queue.' }
    ]
  },
  {
    id: 'tx_7829102CC',
    razorpayPaymentId: 'pay_Njq9P',
    razorpayOrderId: 'order_Njq9P_ord',
    amount: 999,
    currency: 'INR',
    status: 'PENDING',
    action: 'Subscription Renewal',
    customer: { id: 'cust_03', name: 'Sarah Jenkins', email: 'sarah.j@example.com' },
    missionId: 'mission_revenue_sprint_01',
    agentId: 'Sub-Manager',
    policyApplied: 'Pending Approval',
    createdAt: '2023-10-24T13:45:00.000Z',
    source: 'AGENT_PROPOSED',
    executionTrail: [
      { id: 'st_1', name: 'Agent Intent', timestamp: '13:44:50', status: 'SUCCESS', description: 'Scheduled monthly subscription charge.' },
      { id: 'st_2', name: 'Gateway: Razorpay', timestamp: '13:45:00', status: 'INFO', description: 'Awaiting customer 3DS verification.' }
    ]
  },
  {
    id: 'tx_7829101DD',
    razorpayPaymentId: 'pay_Njq2A',
    razorpayOrderId: 'order_Njq2A_ord',
    amount: 5000,
    currency: 'INR',
    status: 'SUCCESS',
    action: 'Credit Top-up',
    customer: { id: 'cust_04', name: 'Design Studio 5', email: 'accounts@designstudio5.com' },
    missionId: 'mission_revenue_sprint_01',
    agentId: 'Wallet-Bot',
    policyApplied: 'Auto-Approve',
    createdAt: '2023-10-24T11:20:10.000Z',
    source: 'ORGANIC',
    executionTrail: [
      { id: 'st_1', name: 'Customer Action', timestamp: '11:19:55', status: 'SUCCESS', description: 'Customer initiated corporate wallet top-up.' },
      { id: 'st_2', name: 'Razorpay Gateway', timestamp: '11:20:10', status: 'SUCCESS', description: 'Payment captured: pay_Njq2A' }
    ]
  },
  {
    id: 'tx_7829100EE',
    razorpayPaymentId: 'pay_Njq9Z',
    razorpayOrderId: 'order_Njq9Z_ord',
    amount: 12450,
    currency: 'INR',
    status: 'SUCCESS',
    action: 'Vendor Payout',
    customer: { id: 'cust_05', name: 'CloudHost Services', email: 'billing@cloudhost.net' },
    missionId: 'mission_revenue_sprint_01',
    agentId: 'Fin-Agent',
    policyApplied: 'Manager Approved',
    createdAt: '2023-10-23T16:05:44.000Z',
    source: 'MANUAL',
    executionTrail: [
      { id: 'st_1', name: 'Manager Override', timestamp: '16:00:00', status: 'SUCCESS', description: 'Approved by Sarah Jenkins.' },
      { id: 'st_2', name: 'Payout Executed', timestamp: '16:05:44', status: 'SUCCESS', description: 'Razorpay Payouts batch executed.' }
    ]
  },
  {
    id: 'tx_7829099FF',
    razorpayPaymentId: 'pay_Njq4X',
    razorpayOrderId: 'order_Njq4X_ord',
    amount: 450,
    currency: 'INR',
    status: 'SUCCESS',
    action: 'Refund Process',
    customer: { id: 'cust_06', name: 'Emma Watson', email: 'emma.w@example.com' },
    missionId: 'mission_revenue_sprint_01',
    agentId: 'CS-Bot',
    policyApplied: 'Standard Refund',
    createdAt: '2023-10-23T14:22:11.000Z',
    source: 'AGENT_PROPOSED',
    executionTrail: [
      { id: 'st_1', name: 'Refund Completed', timestamp: '14:22:11', status: 'SUCCESS', description: 'CS-Bot issued standard refund for duplicate order.' }
    ]
  },
  {
    id: 'tx_7829098GG',
    razorpayPaymentId: 'pay_Njq5Y',
    razorpayOrderId: 'order_Njq5Y_ord',
    amount: 399,
    currency: 'INR',
    status: 'SUCCESS',
    action: 'Campaign Purchase',
    customer: { id: 'cust_07', name: 'Rohan Sharma', email: 'rohan.sharma@gmail.com' },
    missionId: 'mission_revenue_sprint_01',
    campaignId: 'camp_02',
    agentId: 'Campaign-Bot',
    policyApplied: 'Autonomous Checkout',
    createdAt: '2023-10-23T12:10:05.000Z',
    source: 'RECOVERED',
    executionTrail: [
      { id: 'st_1', name: 'Cart Nudge Converted', timestamp: '12:10:05', status: 'SUCCESS', description: 'Customer converted from SMS payment link.' }
    ]
  },
  {
    id: 'tx_7829097HH',
    razorpayPaymentId: 'pay_Njq6Z',
    razorpayOrderId: 'order_Njq6Z_ord',
    amount: 798,
    currency: 'INR',
    status: 'SUCCESS',
    action: 'Combo Lunch Bundle',
    customer: { id: 'cust_08', name: 'Priya Patel', email: 'priya.p@outlook.com' },
    missionId: 'mission_revenue_sprint_01',
    campaignId: 'camp_01',
    agentId: 'Revenue-Agent',
    policyApplied: 'Autonomous Checkout',
    createdAt: '2023-10-23T11:45:19.000Z',
    source: 'AGENT_PROPOSED'
  },
  {
    id: 'tx_7829096II',
    razorpayPaymentId: 'pay_Njq7A',
    razorpayOrderId: 'order_Njq7A_ord',
    amount: 1596,
    currency: 'INR',
    status: 'SUCCESS',
    action: 'Group Lunch Order',
    customer: { id: 'cust_09', name: 'Kunal Verma', email: 'kunal@startup.io' },
    missionId: 'mission_revenue_sprint_01',
    campaignId: 'camp_01',
    agentId: 'Revenue-Agent',
    policyApplied: 'Autonomous Checkout',
    createdAt: '2023-10-22T13:30:10.000Z',
    source: 'AGENT_PROPOSED'
  },
  {
    id: 'tx_7829095JJ',
    razorpayPaymentId: 'pay_Njq8B',
    razorpayOrderId: 'order_Njq8B_ord',
    amount: 599,
    currency: 'INR',
    status: 'FAILED',
    action: 'Family Meal Purchase',
    customer: { id: 'cust_10', name: 'Ananya Roy', email: 'ananya.roy@yahoo.com' },
    missionId: 'mission_revenue_sprint_01',
    agentId: 'Payment-Bot',
    policyApplied: 'Standard Payment',
    createdAt: '2023-10-22T10:15:40.000Z',
    source: 'ORGANIC'
  }
];

export const initialAuditEvents: AuditEvent[] = [
  {
    id: 'aud_01',
    timestamp: '2023-10-24T14:32:05.000Z',
    actor: 'Agent (Revenue Engine)',
    actorType: 'AGENT',
    action: 'Campaign Budget Approved',
    entityType: 'CAMPAIGN',
    entityId: 'camp_02',
    intent: 'Reallocate Q3 budget to high-converting cart recovery ad inventory',
    reason: 'Analyzed Q4 pipeline projections against historical CAC. Approved reallocation from unused Q3 travel budget to capitalize on projected 12% drop in ad inventory costs in early November.',
    evidence: [
      'Salesforce Q4 Pipeline Report (ID: #882)',
      'Expensify YTD T&E Aggregate',
      'Market Data: Ad Spend Index'
    ],
    policyChecks: [
      { policyId: 'pol_daily_spend', policyName: 'Budget Validated', passed: true, message: 'Passed' },
      { policyId: 'pol_min_roi', policyName: 'ROI Threshold Met', passed: true, message: 'Passed' },
      { policyId: 'pol_unrecognized_vendors', policyName: 'Vendor Whitelisted', passed: true, message: 'Passed' }
    ],
    status: 'SUCCESS',
    correlationId: 'corr_aud_01',
    amount: 45000,
    tag: 'Execution'
  },
  {
    id: 'aud_02',
    timestamp: '2023-10-24T11:15:22.000Z',
    actor: 'Policy Engine',
    actorType: 'POLICY_ENGINE',
    action: 'Vendor Payment Flagged',
    entityType: 'TRANSACTION',
    entityId: 'tx_7829100EE',
    intent: 'Flag single-month expense variance deviation for Cloud Infrastructure',
    reason: 'Invoice amount deviates from historical 6-month average by +42%. While within total department budget limits, the single-month variance exceeds autonomous approval threshold (Policy #44-B). Escalated to Human-in-the-Loop.',
    evidence: [
      'Historical 6-month CloudHost spend log',
      'Server load spike analysis during weekend campaign'
    ],
    policyChecks: [
      { policyId: 'pol_daily_spend', policyName: 'Budget Validated', passed: true, message: 'Passed' },
      { policyId: 'pol_max_single_txn', policyName: 'Anomalous Variance', passed: false, requiresApproval: true, message: 'Variance +42% exceeds autonomous threshold.' }
    ],
    status: 'WARNING',
    correlationId: 'corr_aud_02',
    amount: 12450,
    tag: 'Escalation'
  },
  {
    id: 'aud_03',
    timestamp: '2023-10-23T09:00:00.000Z',
    actor: 'Agent (Treasury Risk)',
    actorType: 'AGENT',
    action: 'Auto-adjusted FX Hedging Ratio',
    entityType: 'POLICY',
    entityId: 'pol_fx_hedge',
    intent: 'Protect projected Q4 EUR receivables against volatility ahead of ECB rate decision',
    reason: 'Detected increased macro volatility indicators in European markets ahead of ECB rate decision. Automatically increased hedge ratio from 50% to 65% to protect projected Q4 EUR receivables, adhering to Treasury Risk Mandate (TRM-01).',
    evidence: [
      'Bloomberg Terminal Feed API (VIX, EUR Vol)',
      'Internal AR Projection Model v2.4'
    ],
    status: 'SUCCESS',
    correlationId: 'corr_aud_03',
    amount: 65,
    tag: 'Policy Update'
  },
  {
    id: 'aud_04',
    timestamp: '2023-10-22T16:20:10.000Z',
    actor: 'System Rules',
    actorType: 'SYSTEM',
    action: 'Automated Refund Executed',
    entityType: 'TRANSACTION',
    entityId: 'tx_7829104AC',
    intent: 'Auto-refund customer Alex Mercer under Standard Refund Policy',
    reason: 'Verified return receipt within 30-day window.',
    evidence: ['Receipt #REC-8819', 'Return tracking tag #TRK-91'],
    status: 'SUCCESS',
    correlationId: 'corr_aud_04',
    amount: 1250,
    tag: 'Execution'
  },
  {
    id: 'aud_05',
    timestamp: '2023-10-21T18:00:00.000Z',
    actor: 'Sarah Jenkins',
    actorType: 'USER',
    action: 'Policy Updated: Min ROI Threshold',
    entityType: 'POLICY',
    entityId: 'pol_min_roi',
    intent: 'Raise minimum ROI threshold from 1.5x to 2.0x for Q4 optimization',
    reason: 'Merchant requested higher margin capital allocation.',
    evidence: ['User dashboard settings session'],
    status: 'SUCCESS',
    correlationId: 'corr_aud_05',
    tag: 'User Action'
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif_01',
    title: 'New Approval Required',
    message: 'MKT-BOT-04 requested ₹1,850 for AdTech Solutions marketing slot.',
    type: 'APPROVAL_REQUIRED',
    timestamp: '2023-10-24T13:10:00.000Z',
    read: false,
    linkTo: '/approvals',
    entityId: 'dec_pending_02'
  },
  {
    id: 'notif_02',
    title: 'Payment Received',
    message: 'Successfully captured ₹1,250 refund resolution.',
    type: 'PAYMENT_SUCCESS',
    timestamp: '2023-10-24T14:32:01.000Z',
    read: false,
    linkTo: '/transactions',
    entityId: 'tx_7829104AC'
  },
  {
    id: 'notif_03',
    title: 'Active Protection Enforced',
    message: 'All 14 guardrail checks verified across latest execution batch.',
    type: 'POLICY_VIOLATION',
    timestamp: '2023-10-24T12:00:00.000Z',
    read: true,
    linkTo: '/policies'
  }
];

export const initialRazorpayConfig: RazorpayConfig = {
  keyId: 'rzp_test_9kL2aP0qMnB7vX',
  keySecret: '••••••••••••••••••••••••',
  webhookSecret: '••••••••••••••••••••',
  testMode: true,
  isConnected: true,
  merchantId: 'acc_ShioCafe_Test'
};
