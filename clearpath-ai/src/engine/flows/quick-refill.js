// src/engine/flows/quick-refill.js
// Maria's quick refill flow (and generic refill for any persona)

import { msg, POST_FLOW_PILLS } from '../utils.js';

export const QuickRefillFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();
    const a = persona?.account || {};

    switch (stepId) {

      case 'start':
        return {
          response: msg(
            `Want to add 5 GB right now for $15? I'll charge your ${a.savedCard || 'card on file'}. Takes about 2 seconds.`,
            [
              { label: 'Yes — do it',        intent: 'confirm_refill' },
              { label: 'Show other options', intent: 'show_options'   },
              { label: 'Cancel',             intent: 'cancel'         },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'confirm_or_cancel',
          contextPatch: {},
          endFlow:      false,
        };

      case 'confirm_or_cancel': {
        // "Yes — do it", "confirm", "yes", "go ahead", "do it"
        const isConfirm = lower.includes('yes') || lower.includes('do it') ||
          lower.includes('confirm') || lower.includes('go ahead') ||
          lower.includes('add it') || lower.includes('sure');
        const isCancel = lower.includes('cancel') || lower.includes('no') ||
          lower.includes('never mind') || lower.includes('nevermind') ||
          lower.includes('stop');

        if (isCancel) {
          return {
            response: msg(
              `No problem. Is there anything else I can help you with?`,
              [
                { label: 'Why am I running out?', intent: 'diagnose_usage' },
                { label: 'Change my plan',         intent: 'plan_change'    },
                { label: 'Go back home',           intent: 'done'           },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }

        if (isConfirm) {
          return {
            response: `Confirming now.\n[REFILL_FLOW]`,
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }

        // Ambiguous — re-prompt
        return {
          response: msg(
            `Just to confirm — add 5 GB for $15 to your ${a.savedCard || 'card on file'}?`,
            [
              { label: 'Yes — add 5 GB for $15', intent: 'confirm_refill' },
              { label: 'Cancel',                 intent: 'cancel'         },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'confirm_or_cancel',
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
