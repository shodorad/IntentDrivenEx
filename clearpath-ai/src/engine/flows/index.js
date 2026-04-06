import { QuickRefillFlow }        from './quick-refill.js';
import { DiagnoseUsageFlow }      from './diagnose-usage.js';
import { PlanChangeFlow }         from './plan-change.js';
import { TroubleshootSignalFlow } from './troubleshoot-signal.js';
import { UpgradeFlow }            from './upgrade.js';
import { BrowsePlansFlow }        from './browse-plans.js';
import { BrowsePhonesFlow }       from './browse-phones.js';
import { ActivationFlow }         from './activation.js';
import { InternationalFlow }      from './international.js';
import { BrowseRewardsFlow }      from './browse-rewards.js';
import { msg }                    from '../utils.js';

// ── Terminal intent flows ─────────────────────────────────────────────────────
// These handle explicit pill intents that previously fell through to genericClarify.

const ConfirmRefillFlow = {
  step(_stepId, _userText, _ctx, _persona) {
    return {
      response: `Confirming now.\n[REFILL_FLOW]`,
      nextFlowId:   null,
      nextStepId:   'flow_complete',
      contextPatch: {},
      endFlow:      true,
    };
  },
};

const ConfirmUpgradeFlow = {
  step(_stepId, _userText, _ctx, _persona) {
    return {
      response: `Confirming your plan upgrade now.\n[UPGRADE_FLOW]`,
      nextFlowId:   null,
      nextStepId:   'flow_complete',
      contextPatch: {},
      endFlow:      true,
    };
  },
};

const CancelFlow = {
  step(_stepId, _userText, _ctx, _persona) {
    return {
      response: msg(
        `No problem. Is there anything else I can help you with?`,
        [
          { label: 'Why am I running out?', intent: 'diagnose_usage' },
          { label: 'Quick Refill — $15',   intent: 'quick_refill'   },
          { label: 'Go back home',          intent: 'done'           },
        ]
      ),
      nextFlowId:   null,
      nextStepId:   'flow_complete',
      contextPatch: {},
      endFlow:      true,
    };
  },
};

const UpgradeAtRenewalFlow = {
  step(_stepId, _userText, _ctx, persona) {
    const a = persona?.account || {};
    return {
      response: msg(
        `Done — your upgrade to Total 5G Unlimited is scheduled for ${a.renewalDate || 'your next renewal'}. Nothing to pay today.\n\nWant me to add 5 GB now to cover you until then?`,
        [
          { label: 'Yes — add 5 GB for $15', intent: 'quick_refill' },
          { label: "I'll manage",             intent: 'done'          },
        ]
      ),
      nextFlowId:   null,
      nextStepId:   'flow_complete',
      contextPatch: {},
      endFlow:      true,
    };
  },
};

const RedeemPointsFlow = {
  step(_stepId, _userText, _ctx, _persona) {
    return {
      response: `[REDEEM_FLOW]`,
      nextFlowId:   null,
      nextStepId:   'flow_complete',
      contextPatch: {},
      endFlow:      true,
    };
  },
};

const KeepPlanFlow = {
  step(_stepId, _userText, _ctx, persona) {
    const a = persona?.account || {};
    return {
      response: msg(
        `No problem. You're staying on ${a.plan || 'Total Base 5G'}. If you need data before ${a.renewalDate || 'your renewal date'}, come back and I can add it in seconds.\n\nAnything else I can help with?`,
        [
          { label: 'Add data now — $15', intent: 'quick_refill' },
          { label: 'Go back home',        intent: 'done'          },
        ]
      ),
      nextFlowId:   null,
      nextStepId:   'flow_complete',
      contextPatch: {},
      endFlow:      true,
    };
  },
};

const ShowOptionsFlow = {
  step(_stepId, _userText, _ctx, persona) {
    const a = persona?.account || {};
    return {
      response: msg(
        `Here are your options:\n\n• Add 5 GB for $15 — activates instantly, keeps your current plan\n• Upgrade to Unlimited — $55/mo, no more caps, includes Disney+\n• Wait until ${a.renewalDate || 'your renewal date'} — your plan renews soon`,
        [
          { label: 'Add 5 GB — $15',      intent: 'quick_refill' },
          { label: 'Switch to Unlimited', intent: 'plan_change'  },
          { label: "I'll wait",            intent: 'cancel'       },
        ]
      ),
      nextFlowId:   null,
      nextStepId:   'flow_complete',
      contextPatch: {},
      endFlow:      true,
    };
  },
};

const TryFreeFixesFlow = {
  step(_stepId, _userText, _ctx, persona) {
    const a = persona?.account || {};
    return {
      response: msg(
        `Great call. Here's a recap of the three fixes to try:\n\n1. Settings → turn off "Wi-Fi Assist"\n2. YouTube / Netflix → set to "Wi-Fi only"\n3. Settings → General → Background App Refresh → off\n\nIf you run out before ${a.renewalDate || 'your renewal date'}, come back and I can add data instantly.\n\nAnything else?`,
        [
          { label: 'Add data anyway — $15', intent: 'quick_refill' },
          { label: 'Go back home',           intent: 'done'         },
        ]
      ),
      nextFlowId:   null,
      nextStepId:   'flow_complete',
      contextPatch: {},
      endFlow:      true,
    };
  },
};

export const FLOW_REGISTRY = {
  // Primary intents map directly to flows
  quick_refill:   QuickRefillFlow,
  diagnose_usage: DiagnoseUsageFlow,
  plan_change:    PlanChangeFlow,
  support:        TroubleshootSignalFlow,
  upgrade_now:    UpgradeFlow,
  browse_plans:   BrowsePlansFlow,
  browse_phones:  BrowsePhonesFlow,
  activate:       ActivationFlow,
  international:  InternationalFlow,
  browse_rewards: BrowseRewardsFlow,

  // Terminal intents — explicit pill intents that resolve without text-matching
  try_free_fixes:     TryFreeFixesFlow,
  confirm_refill:     ConfirmRefillFlow,
  confirm_upgrade:    ConfirmUpgradeFlow,
  cancel:             CancelFlow,
  upgrade_at_renewal: UpgradeAtRenewalFlow,
  keep_plan:          KeepPlanFlow,
  show_options:       ShowOptionsFlow,
  redeem_points:      RedeemPointsFlow,

  // Aliases — same flow, different entry points
  'slow-data':          DiagnoseUsageFlow,
  'runs-out':           DiagnoseUsageFlow,
  cost:                 PlanChangeFlow,
  compare:              BrowsePlansFlow,
  byop:                 ActivationFlow,
  browse_rewards_earn:  BrowseRewardsFlow,
  browse_rewards_redeem: BrowseRewardsFlow,

  // Landing pill intents — persona suggestedActions that must route directly
  add_data:          QuickRefillFlow,       // "Add 5 GB of data — $10" (Maria)
  upgrade_unlimited: PlanChangeFlow,        // "Upgrade to Unlimited" (various)
  renew_current:     QuickRefillFlow,       // "Renew Total Base 5G" (Carlos)
  renew_early:       QuickRefillFlow,       // "Renew full plan early" (Priya)
  redeem_points:     RedeemPointsFlow,      // "Redeem 1,000 pts" (Priya / Alex)
  check_outage:      TroubleshootSignalFlow,// "Check for outages" (Angela)
  self_fix:          TroubleshootSignalFlow,// "Walk me through a fix" (Angela)
  escalate_support:  TroubleshootSignalFlow,// "Talk to someone" (Angela)
  check_deals:       BrowsePhonesFlow,      // "What deals do I qualify for?" (Alex)
  browse_deals:      BrowsePhonesFlow,      // "What's the best deal right now?" (Alex)
  compare_phones:    BrowsePhonesFlow,      // "Compare iPhone vs Samsung" (Alex)
  redeem_calling_card: InternationalFlow,   // "Redeem 1,000 pts — get it free" (Ana)
  add_calling_card:  InternationalFlow,     // "Add Global Calling Card" (Ana)
  browse_addons:     InternationalFlow,     // "See all calling options" (Ana)
  compare_plans:     BrowsePlansFlow,       // "See side-by-side plan comparison" (Robert)
  family_pricing:    BrowsePlansFlow,       // "Calculate 4-line family pricing" (Robert)
  activate_esim:     ActivationFlow,        // "Activate eSIM" (James)
  scan_sim:          ActivationFlow,        // "Scan physical SIM" (James)
  port_in:           ActivationFlow,        // "Port my number" (James)
  activate_phone:    ActivationFlow,        // "Activate my new phone" (Nina)
  port_number:       ActivationFlow,        // "Port my current number" (Nina)
  pick_plan:         BrowsePlansFlow,       // "Pick a plan" (Nina)
};
