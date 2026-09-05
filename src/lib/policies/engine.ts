import { 
  AgentDecision, 
  Mission, 
  Policy, 
  Agent, 
  PolicyEvaluation, 
  PolicyCheckResult 
} from '../../types';

export class PolicyEngine {
  /**
   * Deterministically evaluates a proposed decision against active policies, mission constraints, and agent state.
   */
  static evaluate(
    decision: AgentDecision,
    mission: Mission,
    policies: Policy[],
    agent: Agent
  ): PolicyEvaluation {
    const checks: PolicyCheckResult[] = [];
    let isBlocked = false;
    let requiresApproval = false;
    const reasons: string[] = [];

    // 1. Agent State Validation
    if (agent.status !== 'ONLINE') {
      checks.push({
        policyId: 'agent_status_check',
        policyName: 'Agent Operating State',
        passed: false,
        message: `Agent is not active (current status: ${agent.status}). Autonomous execution is forbidden.`
      });
      isBlocked = true;
      reasons.push(`Agent is in ${agent.status} state.`);
    } else {
      checks.push({
        policyId: 'agent_status_check',
        policyName: 'Agent Operating State',
        passed: true,
        message: 'Agent is ONLINE and healthy.'
      });
    }

    // 2. Mission State Validation
    if (mission.status !== 'RUNNING') {
      checks.push({
        policyId: 'mission_status_check',
        policyName: 'Mission Status Check',
        passed: false,
        message: `Target mission '${mission.name}' is ${mission.status}. Actions cannot be executed on non-running missions.`
      });
      isBlocked = true;
      reasons.push(`Mission status is ${mission.status}.`);
    } else {
      checks.push({
        policyId: 'mission_status_check',
        policyName: 'Mission Status Check',
        passed: true,
        message: `Mission '${mission.name}' is RUNNING.`
      });
    }

    const proposedCost = decision.proposedAction.amount || 0;
    const remainingBudget = mission.budget - mission.spent;

    // 3. Mission Budget Check
    if (proposedCost > remainingBudget) {
      checks.push({
        policyId: 'mission_budget_check',
        policyName: 'Mission Budget Ceiling',
        passed: false,
        threshold: remainingBudget,
        actual: proposedCost,
        message: `Proposed cost ₹${proposedCost.toLocaleString()} exceeds remaining mission budget ₹${remainingBudget.toLocaleString()}.`
      });
      isBlocked = true;
      reasons.push(`Exceeds remaining mission budget (₹${remainingBudget.toLocaleString()} remaining).`);
    } else {
      checks.push({
        policyId: 'mission_budget_check',
        policyName: 'Mission Budget Ceiling',
        passed: true,
        threshold: remainingBudget,
        actual: proposedCost,
        message: `Within remaining budget (₹${(remainingBudget - proposedCost).toLocaleString()} will remain).`
      });
    }

    // 4. Evaluate Active Policies from Config
    for (const policy of policies) {
      if (!policy.enabled) continue;

      switch (policy.type) {
        case 'DAILY_SPEND_LIMIT': {
          const limit = typeof policy.value === 'number' ? policy.value : parseFloat(String(policy.value)) || 2000;
          if (proposedCost > limit) {
            checks.push({
              policyId: policy.id,
              policyName: policy.name,
              passed: false,
              threshold: limit,
              actual: proposedCost,
              message: `Action amount ₹${proposedCost.toLocaleString()} breaches maximum daily spend limit of ₹${limit.toLocaleString()}.`
            });
            isBlocked = true;
            reasons.push(`Breaches daily limit ₹${limit.toLocaleString()}.`);
          } else {
            checks.push({
              policyId: policy.id,
              policyName: policy.name,
              passed: true,
              threshold: limit,
              actual: proposedCost,
              message: `Within daily spend ceiling of ₹${limit.toLocaleString()}.`
            });
          }
          break;
        }

        case 'SINGLE_TRANSACTION_LIMIT': {
          const limit = typeof policy.value === 'number' ? policy.value : parseFloat(String(policy.value)) || 1500;
          if (proposedCost > limit) {
            checks.push({
              policyId: policy.id,
              policyName: policy.name,
              passed: false,
              requiresApproval: true,
              threshold: limit,
              actual: proposedCost,
              message: `Requested amount ₹${proposedCost.toLocaleString()} exceeds single transaction limit ₹${limit.toLocaleString()}. Escalated to human review.`
            });
            requiresApproval = true;
            reasons.push(`Amount ₹${proposedCost.toLocaleString()} requires manual approval (limit ₹${limit.toLocaleString()}).`);
          } else {
            checks.push({
              policyId: policy.id,
              policyName: policy.name,
              passed: true,
              threshold: limit,
              actual: proposedCost,
              message: `Within single transaction limit (₹${proposedCost.toLocaleString()} <= ₹${limit.toLocaleString()}).`
            });
          }
          break;
        }

        case 'MINIMUM_ROI': {
          const minROI = typeof policy.value === 'number' ? policy.value : parseFloat(String(policy.value)) || 2.0;
          if (decision.expectedROI < minROI) {
            checks.push({
              policyId: policy.id,
              policyName: policy.name,
              passed: false,
              threshold: minROI,
              actual: decision.expectedROI,
              message: `Expected ROI (${decision.expectedROI.toFixed(1)}x) does not meet minimum required threshold (${minROI.toFixed(1)}x).`
            });
            isBlocked = true;
            reasons.push(`Expected ROI (${decision.expectedROI.toFixed(1)}x) below requirement (${minROI.toFixed(1)}x).`);
          } else {
            checks.push({
              policyId: policy.id,
              policyName: policy.name,
              passed: true,
              threshold: minROI,
              actual: decision.expectedROI,
              message: `Expected ROI ${decision.expectedROI.toFixed(1)}x meets target (>= ${minROI.toFixed(1)}x).`
            });
          }
          break;
        }

        case 'UNRECOGNIZED_VENDORS': {
          const isUnrecognized = decision.proposedAction.vendor && 
            (decision.proposedAction.vendor.toLowerCase().includes('unknown') || 
             decision.proposedAction.vendor.toLowerCase().includes('unverified') ||
             decision.proposedAction.vendor.toLowerCase().includes('offshore'));
          
          if (isUnrecognized) {
            checks.push({
              policyId: policy.id,
              policyName: policy.name,
              passed: false,
              requiresApproval: true,
              message: `Vendor '${decision.proposedAction.vendor}' is not in the approved whitelist directory.`
            });
            requiresApproval = true;
            reasons.push(`Unrecognized vendor '${decision.proposedAction.vendor}'.`);
          } else {
            checks.push({
              policyId: policy.id,
              policyName: policy.name,
              passed: true,
              message: 'Vendor identity validated against verified directory.'
            });
          }
          break;
        }

        case 'GEO_FENCING': {
          if (policy.enabled && policy.value === 'Restricted') {
            checks.push({
              policyId: policy.id,
              policyName: policy.name,
              passed: true,
              message: 'Target recipient within allowed domestic financial boundary.'
            });
          }
          break;
        }

        default:
          break;
      }
    }

    // Final outcome synthesis
    if (isBlocked) {
      return {
        allowed: false,
        requiresApproval: false,
        reason: reasons.join(' ') || 'Blocked by security policies.',
        checks
      };
    }

    if (requiresApproval) {
      return {
        allowed: true,
        requiresApproval: true,
        reason: reasons.join(' ') || 'Action exceeds autonomous threshold and requires Human-in-the-Loop approval.',
        checks
      };
    }

    return {
      allowed: true,
      requiresApproval: false,
      reason: 'All policy checks passed successfully. Autonomous execution permitted.',
      checks
    };
  }
}
