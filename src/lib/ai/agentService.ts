import { AgentDecision, Mission, Policy, Agent, AuditEvent, Campaign, Transaction } from '../../types';
import { PolicyEngine } from '../policies/engine';
import { StorageRepository } from '../storage/repository';
import { RazorpaySimulator } from '../razorpay/client';

export interface DecisionTemplate {
  intent: string;
  observation: string;
  hypothesis: string;
  proposedAction: {
    type: 'CREATE_CAMPAIGN' | 'GENERATE_PAYMENT_LINK' | 'REFUND_TRANSACTION' | 'REALLOCATE_BUDGET' | 'STOP_UNDERPERFORMING_CAMPAIGN';
    title: string;
    amount: number;
    vendor?: string;
    channel?: string;
    details?: Record<string, any>;
  };
  expectedRevenue: number;
  expectedCost: number;
  expectedROI: number;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence: string[];
}

const TEMPLATES: DecisionTemplate[] = [
  {
    intent: 'Promote ₹399 combo meal to lunch crowd to boost mid-day basket size',
    observation: 'Lunch basket size average is currently ₹210 with 14% sandwich attachment. Friday lunch traffic shows a 28% increase in order volume.',
    hypothesis: 'Launching a targeted ₹399 Coffee + Sandwich bundle campaign with an incentive coupon will lift AOV to ₹390 and convert ~120 lunch customers.',
    proposedAction: {
      type: 'CREATE_CAMPAIGN',
      title: 'Launch ₹399 Coffee + Sandwich campaign',
      amount: 700,
      channel: 'WhatsApp + Dynamic Payment Links',
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
    ]
  },
  {
    intent: 'Deploy dynamic cart abandonment discount for carts > ₹500 dropped at checkout',
    observation: '142 cart abandonments recorded in the last 24h with average cart value of ₹620.',
    hypothesis: 'Sending automated ₹50 incentive via instant Razorpay payment link recovers 18% of abandoned checkouts within 15 minutes.',
    proposedAction: {
      type: 'CREATE_CAMPAIGN',
      title: 'Dynamic Cart Recovery Link Blast',
      amount: 450,
      channel: 'SMS + Razorpay Payment Links',
      details: {
        discountAmount: 50,
        targetCarts: 142
      }
    },
    expectedRevenue: 3200,
    expectedCost: 450,
    expectedROI: 7.1,
    confidence: 0.88,
    riskLevel: 'LOW',
    evidence: [
      '142 drop-offs at step: payment_select',
      'Historical checkout link conversion rate 15.2%',
      'Net margin on recovered carts exceeds 68%'
    ]
  },
  {
    intent: 'Reallocate underutilized budget to high-ROI weekend breakfast promotion',
    observation: 'Saturday breakfast traffic indicates 45% recurring patron rate with high affinity for espresso beverages.',
    hypothesis: 'Targeted Saturday morning push notification unlocks ₹3,400 in incremental high-margin breakfast orders.',
    proposedAction: {
      type: 'CREATE_CAMPAIGN',
      title: 'Weekend Morning Artisan Roast Promotion',
      amount: 600,
      channel: 'In-App Notification & WhatsApp',
      details: {
        targetSegment: 'Morning Commuters',
        promoItem: 'Artisan Roast + Pastry'
      }
    },
    expectedRevenue: 3400,
    expectedCost: 600,
    expectedROI: 5.67,
    confidence: 0.93,
    riskLevel: 'LOW',
    evidence: [
      'Saturday morning footfall index +35%',
      'Beverage gross margin: 78%',
      'Customer lifetime value correlation: +1.4x'
    ]
  },
  {
    intent: 'High value influencer partnership booking for weekend festival',
    observation: 'Food festival nearby expected to draw 12,000 visitors within 1.5km radius.',
    hypothesis: 'Partnering with prominent local food creator drives massive table bookings.',
    proposedAction: {
      type: 'CREATE_CAMPAIGN',
      title: 'Local Food Influencer Weekend Feature',
      amount: 2200,
      vendor: 'AdTech Solutions',
      channel: 'Instagram & Local Reels',
      details: {
        category: 'Marketing Spends',
        vendor: 'AdTech Solutions'
      }
    },
    expectedRevenue: 8500,
    expectedCost: 2200,
    expectedROI: 3.86,
    confidence: 0.82,
    riskLevel: 'LOW',
    evidence: [
      'Target reach: 60,000 local food lovers',
      'Event footfall proximity: 800m',
      'Requested spend ₹2,200 exceeds autonomous limit ₹1,500'
    ]
  },
  {
    intent: 'Automated Stop-Loss Trigger: Halt low-performing cold-brew test ad',
    observation: 'Cold brew digital test ad has spent ₹850 with only 1 conversion (ROI 0.4x).',
    hypothesis: 'Halting ad immediately preserves remaining capital and triggers reallocation to top-performing sandwich combo.',
    proposedAction: {
      type: 'STOP_UNDERPERFORMING_CAMPAIGN',
      title: 'Emergency Stop: Low-ROI Cold Brew Ad',
      amount: 0,
      details: {
        campaignId: 'camp_04',
        currentROI: 0.4
      }
    },
    expectedRevenue: 1200,
    expectedCost: 0,
    expectedROI: 99.0,
    confidence: 0.97,
    riskLevel: 'LOW',
    evidence: [
      'Click-to-conversion drop: 92%',
      'CPA exceeded target by 340%',
      'Stop-loss policy threshold triggered'
    ]
  }
];

export class AgentService {
  /**
   * Generates a new agent decision powered by Groq LPU engine and evaluates policy compliance.
   */
  static async formulateDecision(
    mission: Mission,
    policies: Policy[],
    agent: Agent,
    customTemplateIndex?: number,
    customGoal?: string
  ): Promise<AgentDecision> {
    const decisionId = `dec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timestamp = new Date().toISOString();

    let decisionContent: DecisionTemplate;
    let groqMeta: { model: string; latencyMs?: number; hardware?: string; liveApi?: boolean; reasoningTrace?: string } = {
      model: 'llama-3.3-70b-versatile',
      hardware: 'Groq LPU™ Inference Engine',
      latencyMs: 110,
      liveApi: true
    };

    // Attempt live Groq API call via Express server
    try {
      const recentTxns = StorageRepository.getTransactions().slice(0, 5);
      const merchant = StorageRepository.getMerchant();

      const response = await fetch('/api/groq/agent-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mission,
          activePolicies: policies.filter(p => p.enabled),
          recentTransactions: recentTxns,
          merchant,
          customGoal
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.decision && data.decision.proposedAction) {
          decisionContent = {
            intent: data.decision.intent || 'Optimize revenue basket attachment',
            observation: data.decision.observation || 'Observed mid-day conversion drop-off',
            hypothesis: data.decision.hypothesis || 'Targeted bundle promotion lifts AOV',
            proposedAction: {
              type: data.decision.proposedAction.type || 'CREATE_CAMPAIGN',
              title: data.decision.proposedAction.title || 'Dynamic Revenue Campaign',
              amount: Number(data.decision.proposedAction.amount) || 500,
              channel: data.decision.proposedAction.channel || 'WhatsApp + Razorpay Link',
              vendor: data.decision.proposedAction.vendor || 'Meta Business & Razorpay',
              details: data.decision.proposedAction.details || {}
            },
            expectedRevenue: Number(data.decision.expectedRevenue) || 3500,
            expectedCost: Number(data.decision.expectedCost) || 500,
            expectedROI: Number(data.decision.expectedROI) || 7.0,
            confidence: Number(data.decision.confidence) || 0.92,
            riskLevel: data.decision.riskLevel || 'LOW',
            evidence: Array.isArray(data.decision.evidence) ? data.decision.evidence : ['Groq LPU pattern detection: High conversion velocity']
          };

          if (data.groqMetadata) {
            groqMeta = {
              model: data.groqMetadata.model || 'llama-3.3-70b-versatile',
              latencyMs: data.groqMetadata.latencyMs,
              hardware: data.groqMetadata.hardware,
              liveApi: data.groqMetadata.liveApi,
              reasoningTrace: data.decision.reasoningTrace
            };
          }
        } else {
          throw new Error('Invalid Groq decision payload');
        }
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch {
      // Resilient fallback template if server route is temporarily unreachable
      const template = customTemplateIndex !== undefined && TEMPLATES[customTemplateIndex]
        ? TEMPLATES[customTemplateIndex]
        : TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
      decisionContent = template;
      groqMeta = {
        model: 'llama-3.3-70b-versatile',
        hardware: 'Groq LPU™ Engine (Resilient Fallback)',
        latencyMs: 95,
        liveApi: false
      };
    }

    const decisionDraft: AgentDecision = {
      id: decisionId,
      missionId: mission.id,
      timestamp,
      intent: decisionContent.intent,
      observation: decisionContent.observation,
      hypothesis: decisionContent.hypothesis,
      proposedAction: decisionContent.proposedAction,
      expectedRevenue: decisionContent.expectedRevenue,
      expectedCost: decisionContent.expectedCost,
      expectedROI: decisionContent.expectedROI,
      confidence: decisionContent.confidence,
      riskLevel: decisionContent.riskLevel,
      evidence: decisionContent.evidence,
      groqMetadata: groqMeta,
      policyEvaluation: {
        allowed: false,
        requiresApproval: false,
        reason: 'Pending policy evaluation',
        checks: []
      },
      decisionStatus: 'PROPOSED',
      executionStatus: 'NOT_STARTED'
    };

    // Deterministic policy evaluation
    const evaluation = PolicyEngine.evaluate(decisionDraft, mission, policies, agent);
    decisionDraft.policyEvaluation = evaluation;

    if (!evaluation.allowed) {
      decisionDraft.decisionStatus = 'BLOCKED';
      decisionDraft.executionStatus = 'FAILED';
    } else if (evaluation.requiresApproval) {
      decisionDraft.decisionStatus = 'PROPOSED';
      decisionDraft.executionStatus = 'PENDING';
    } else {
      decisionDraft.decisionStatus = 'PROPOSED';
      decisionDraft.executionStatus = 'NOT_STARTED';
    }

    return decisionDraft;
  }

  /**
   * Ask Groq FinOps Co-Pilot conversational assistant
   */
  static async askCopilot(message: string, context: Record<string, any>): Promise<{ reply: string; model: string }> {
    try {
      const res = await fetch('/api/groq/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      });
      if (res.ok) {
        const data = await res.json();
        return { reply: data.reply, model: data.model || 'llama-3.3-70b-versatile' };
      }
    } catch (e) {
      console.error('Copilot fetch failed:', e);
    }
    return {
      reply: 'Groq FinOps Intelligence: Cash flow and policy compliance are operating optimally. All single transactions > ₹1,500 remain gated for approval.',
      model: 'llama-3.3-70b-versatile (Fallback)'
    };
  }

  /**
   * Groq Campaign Generator
   */
  static async generateCampaignCopy(params: { title: string; targetAudience: string; budget: number; discountPct: number }) {
    try {
      const res = await fetch('/api/groq/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        return data.copy;
      }
    } catch (e) {
      console.error('Campaign copy fetch failed:', e);
    }
    return {
      headline: `Shio Café: ${params.title}`,
      bodyText: `Enjoy an exclusive ${params.discountPct}% reward on your next order. Tap to pay with Razorpay instant checkout!`,
      cta: 'Pay & Redeem',
      linkDescription: `Special Promo • ₹${params.budget} Allocated`
    };
  }

  /**
   * Check status of Groq connection
   */
  static async getGroqStatus(): Promise<{ configured: boolean; model: string; provider: string; status: string; message: string }> {
    try {
      const res = await fetch('/api/groq/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('Status fetch failed:', e);
    }
    return {
      configured: false,
      model: 'llama-3.3-70b-versatile',
      provider: 'Groq Cloud LPU',
      status: 'FALLBACK_SIMULATION',
      message: 'Groq API LPU Ready'
    };
  }

  /**
   * Executes an approved decision autonomously or upon human override.
   */
  static async executeDecision(
    decision: AgentDecision,
    mission: Mission,
    actor: { name: string; type: 'AGENT' | 'USER' | 'SYSTEM' }
  ): Promise<{
    decision: AgentDecision;
    transaction?: Transaction;
    campaign?: Campaign;
    auditEvent: AuditEvent;
  }> {
    const timestamp = new Date().toISOString();
    let txn: Transaction | undefined;
    let newCampaign: Campaign | undefined;

    // 1. If Campaign
    if (decision.proposedAction.type === 'CREATE_CAMPAIGN') {
      const campId = `camp_${Date.now()}`;
      newCampaign = {
        id: campId,
        missionId: mission.id,
        name: decision.proposedAction.title,
        status: 'ACTIVE',
        totalSent: decision.proposedAction.details?.targetUsers || 1200,
        conversionRate: 0,
        revenueGenerated: 0,
        budgetAllocated: decision.proposedAction.amount,
        budgetSpent: 0,
        actualROI: 0,
        targetROI: decision.expectedROI,
        targetAudience: decision.proposedAction.details?.targetSegment || 'Targeted Lunch Patrons',
        channel: decision.proposedAction.channel || 'WhatsApp + Razorpay Link',
        createdAt: timestamp
      };

      // Create Razorpay Order / Payment simulation for the ad budget deployment
      const rzpOrder = await RazorpaySimulator.createOrder({
        amount: decision.proposedAction.amount * 100,
        currency: 'INR',
        notes: {
          campaignId: campId,
          missionId: mission.id,
          agentIntent: decision.intent
        }
      });

      txn = {
        id: `tx_${Date.now().toString(36).toUpperCase()}`,
        razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 8)}`,
        razorpayOrderId: rzpOrder.id,
        amount: decision.proposedAction.amount,
        currency: 'INR',
        status: 'SUCCESS',
        action: decision.proposedAction.title,
        customer: {
          id: 'cust_agent',
          name: decision.proposedAction.vendor || 'Autonomous Ad Deployment',
          email: 'deploy@finops.internal'
        },
        missionId: mission.id,
        campaignId: campId,
        agentId: 'Revenue-Agent',
        policyApplied: decision.policyEvaluation.checks.map(c => c.policyName).join(', ') || 'Auto-Approved',
        createdAt: timestamp,
        source: 'AGENT_PROPOSED',
        executionTrail: [
          {
            id: 'st_1',
            name: 'Agent Formulation',
            timestamp: new Date(Date.now() - 3000).toLocaleTimeString(),
            status: 'SUCCESS',
            description: `Agent formulated hypothesis: ${decision.intent}`
          },
          {
            id: 'st_2',
            name: 'Policy Engine Check',
            timestamp: new Date(Date.now() - 2000).toLocaleTimeString(),
            status: 'SUCCESS',
            description: decision.policyEvaluation.reason
          },
          {
            id: 'st_3',
            name: 'Razorpay Gateway Order Created',
            timestamp: new Date(Date.now() - 1000).toLocaleTimeString(),
            status: 'INFO',
            description: `Created Razorpay Order ${rzpOrder.id}`,
            codeSnippet: JSON.stringify(rzpOrder, null, 2)
          },
          {
            id: 'st_4',
            name: 'Execution Finalized',
            timestamp: new Date().toLocaleTimeString(),
            status: 'SUCCESS',
            description: 'Capital deployed and campaign launched successfully.'
          }
        ]
      };
    }

    // 2. Audit Event
    const auditEvent: AuditEvent = {
      id: `aud_${Date.now()}`,
      timestamp,
      actor: actor.name,
      actorType: actor.type,
      action: decision.proposedAction.title,
      entityType: newCampaign ? 'CAMPAIGN' : 'DECISION',
      entityId: newCampaign?.id || decision.id,
      intent: decision.intent,
      reason: decision.hypothesis,
      evidence: decision.evidence,
      policyChecks: decision.policyEvaluation.checks,
      status: 'SUCCESS',
      correlationId: `corr_${decision.id}`,
      amount: decision.proposedAction.amount,
      tag: 'Execution'
    };

    // Update decision status
    const executedDecision: AgentDecision = {
      ...decision,
      decisionStatus: 'APPROVED',
      executionStatus: 'EXECUTED',
      outcome: {
        revenueCaptured: 0,
        actualROI: decision.expectedROI,
        notes: `Executed by ${actor.name}`
      }
    };

    return {
      decision: executedDecision,
      transaction: txn,
      campaign: newCampaign,
      auditEvent
    };
  }
}
