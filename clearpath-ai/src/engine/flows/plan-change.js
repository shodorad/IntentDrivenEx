// src/engine/flows/plan-change.js
// Plan change / upgrade flow

import { msg, POST_FLOW_PILLS } from '../utils.js';

export const PlanChangeFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();
    const a = persona?.account || {};

    switch (stepId) {

      case 'start':
        return {
          response: msg(
            `Based on your usage, you've needed more than 5 GB almost every month. Here's what would stop this from happening again:\n\n**Total 5G Unlimited** — $55/mo\n✓ Unlimited data (no more running out)\n✓ 10 GB hotspot\n✓ Disney+ included\n✓ Wi-Fi Calling\n\nThat's $15 more than your current ${a.plan || 'plan'} at ${a.planPrice || '$40/mo'}.\n\nYou could start now — you'd only pay ~$7 today (prorated for ${a.daysUntilRenewal || 14} days left). Or switch at your next renewal on ${a.renewalDate || 'your renewal date'} with no charge today.`,
            [
              { label: 'Start now — ~$7 today',                                            intent: 'upgrade_now'        },
              { label: `Switch on ${a.renewalDate || 'renewal'} — free`,                  intent: 'upgrade_at_renewal' },
              { label: 'Stay on my current plan',                                          intent: 'keep_plan'          },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'shown_options',
          contextPatch: {},
          endFlow:      false,
        };

      case 'shown_options': {
        const wantsNow = lower.includes('start now') || lower.includes('upgrade now') ||
          lower.includes('now') || lower.includes('today') || lower.includes('$7');
        const wantsRenewal = lower.includes('renewal') || lower.includes('switch on') ||
          lower.includes('free') || lower.includes('no charge');
        const wantsKeep = lower.includes('stay') || lower.includes('keep') ||
          lower.includes('current plan') || lower.includes('no thanks') ||
          lower.includes('cancel');

        if (wantsNow) {
          return {
            response: msg(
              `Switching you to Total 5G Unlimited now.\n\n┌─────────────────────────────────────────────┐\n│  Total 5G Unlimited                         │\n│  $55/mo  (was ${a.planPrice || '$40/mo'})                       │\n│  Prorated today: ~$7 (${a.daysUntilRenewal || 14} days left)          │\n│  Charged to: ${a.savedCard || 'card on file'}               │\n└─────────────────────────────────────────────┘\n\nConfirm?`,
              [
                { label: 'Yes — upgrade now',         intent: 'confirm_upgrade'   },
                { label: 'Switch at renewal instead', intent: 'upgrade_at_renewal' },
                { label: 'Cancel',                    intent: 'cancel'             },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'confirm_upgrade',
            contextPatch: { wantsNow: true },
            endFlow:      false,
          };
        }

        if (wantsRenewal) {
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
        }

        if (wantsKeep) {
          return {
            response: msg(
              `No problem. You're staying on ${a.plan || 'Total Base 5G'}. If you need data before ${a.renewalDate || 'your renewal'}, come back and I can add it in seconds.\n\nAnything else I can help with?`,
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
        }

        // Ambiguous / asking for more info
        return {
          response: msg(
            `Would you like to upgrade now or wait until your renewal on ${a.renewalDate || 'your renewal date'}?`,
            [
              { label: 'Upgrade now — ~$7 today',   intent: 'upgrade_now'        },
              { label: 'Wait until renewal — free', intent: 'upgrade_at_renewal' },
              { label: 'Never mind',                intent: 'cancel'              },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'shown_options',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'confirm_upgrade': {
        const isCancel = lower.includes('cancel') || lower.includes('no') ||
          lower.includes('switch at renewal') || lower.includes('never mind');

        if (isCancel && (lower.includes('renewal') || lower.includes('switch at'))) {
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
        }

        if (isCancel) {
          return {
            response: msg(`No problem. Is there anything else I can help with?`, POST_FLOW_PILLS),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }

        // Confirm upgrade
        return {
          response: `Confirming your plan upgrade now.\n[UPGRADE_FLOW]`,
          nextFlowId:   null,
          nextStepId:   'flow_complete',
          contextPatch: {},
          endFlow:      true,
        };
      }

      case 'flow_complete':
        return {
          response: msg(`Is there anything else I can help with?`, POST_FLOW_PILLS),
          nextFlowId:   null,
          nextStepId:   'flow_complete',
          contextPatch: {},
          endFlow:      true,
        };

      default:
        return null;
    }
  }
};
