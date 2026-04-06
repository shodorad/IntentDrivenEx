// src/engine/flows/upgrade.js
// Derek's upgrade flow (and generic upgrade for any persona)

import { msg, POST_FLOW_PILLS } from '../utils.js';

export const UpgradeFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();
    const a = persona?.account || {};

    switch (stepId) {

      case 'start':
        return {
          response: msg(
            `Switching you to Total 5G Unlimited now.\n\n┌─────────────────────────────────────────────┐\n│  Total 5G Unlimited                         │\n│  $55/mo  (was ${a.planPrice || '$40/mo'})                       │\n│  Prorated today: ~$7 (${a.daysUntilRenewal || 14} days left)          │\n│  Charged to: ${a.savedCard || 'card on file'}               │\n└─────────────────────────────────────────────┘\n\nConfirm?`,
            [
              { label: 'Yes — upgrade now',         intent: null },
              { label: 'Switch at renewal instead', intent: null },
              { label: 'Cancel',                    intent: null },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'confirm_or_schedule',
          contextPatch: {},
          endFlow:      false,
        };

      case 'confirm_or_schedule': {
        const isConfirm = lower.includes('yes') || lower.includes('upgrade now') ||
          lower.includes('confirm') || lower.includes('go ahead') || lower.includes('do it');
        const isRenewal = lower.includes('renewal') || lower.includes('switch at') ||
          lower.includes('next cycle') || lower.includes('schedule');
        const isCancel = lower.includes('cancel') || (lower.includes('no') && !lower.includes('now'));

        if (isCancel) {
          return {
            response: msg(`No problem. Is there anything else I can help with?`, POST_FLOW_PILLS),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }

        if (isRenewal) {
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
            contextPatch: { scheduledRenewal: true },
            endFlow:      true,
          };
        }

        if (isConfirm) {
          return {
            response: `Confirming your plan upgrade now.\n[UPGRADE_FLOW]`,
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }

        // Ambiguous — re-prompt
        return {
          response: msg(
            `Ready to upgrade to Total 5G Unlimited ($55/mo)?`,
            [
              { label: 'Yes — upgrade now',         intent: null },
              { label: 'Switch at renewal — free',  intent: null },
              { label: 'Cancel',                    intent: null },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'confirm_or_schedule',
          contextPatch: {},
          endFlow:      false,
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
