// src/engine/flows/international.js
// Ana's (us-007) international calling flow — rewards redemption vs pay

import { msg, POST_FLOW_PILLS } from '../utils.js';

export const InternationalFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();
    const a = persona?.account || {};
    const pts = a.rewardsPoints || 1200;
    const card = a.savedCard || 'Visa ••••9902';

    switch (stepId) {

      case 'start': {
        // User wants to redeem points
        if (lower.includes('redeem') || lower.includes('free') || lower.includes('pts') ||
            lower.includes('points') || lower.includes('yes')) {
          return {
            response: msg(
              `Redeeming 1,000 pts for the Global Calling Card.\n\n┌────────────────────────────────────────────────────────┐\n│  Global Calling Card — FREE (1,000 pts)                │\n│  Value: $10/mo · 200+ countries                        │\n│  Colombia: ~$0.02/min  (was ~$0.25/min)                │\n│  ${pts - 1000 >= 0 ? pts - 1000 : 0} pts remaining after redemption                    │\n└────────────────────────────────────────────────────────┘\n\nConfirm?`,
              [
                { label: 'Yes — get it free',  intent: null },
                { label: 'Pay $10 instead',    intent: null },
                { label: 'Cancel',             intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'confirm_redeem',
            contextPatch: { wantsRedeem: true },
            endFlow:      false,
          };
        }

        // User wants to pay $10
        if (lower.includes('pay $10') || lower.includes('pay instead') || lower.includes('$10')) {
          return {
            response: msg(
              `Sure — charging ${card} $10/mo.\n\n┌──────────────────────────────────────────────────────┐\n│  Global Calling Card — $10/mo                        │\n│  200+ countries · Auto-renews · Cancel anytime       │\n│  Charged to: ${card}                 │\n└──────────────────────────────────────────────────────┘\n\nConfirm?`,
              [
                { label: 'Confirm — $10/mo',       intent: null },
                { label: 'Use points instead',     intent: null },
                { label: 'Cancel',                 intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'confirm_pay',
            contextPatch: { wantsPay: true },
            endFlow:      false,
          };
        }

        // User wants more info
        if (lower.includes('tell me more') || lower.includes('more') || lower.includes('what is')) {
          return {
            response: msg(
              `The Global Calling Card is a $10/mo add-on that gives you discounted rates to 200+ countries:\n\n• Colombia: ~$0.02/min  (you're paying ~$0.25/min now)\n• Mexico: ~$0.02/min\n• Savings: ~$18/mo at your call volume\n\nYour ${pts} points cover the first month free. Auto-renews at $10/mo after that. Cancel anytime.\n\nWant to use your points or pay $10?`,
              [
                { label: 'Get it free with points', intent: null },
                { label: 'Pay $10/mo',              intent: null },
                { label: 'Not right now',           intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'start',
            contextPatch: {},
            endFlow:      false,
          };
        }

        // Show all calling add-ons
        if (lower.includes('all add-on') || lower.includes('see all') || lower.includes('all calling') || lower.includes('all option')) {
          return {
            response: msg(
              `Here are all available add-ons for your account:\n\n• $0  Global Calling Card (1,000 pts — you qualify ✓)\n• $10 Global Calling Card (cash)\n• $10 · 5 GB Data Add-On\n• $20 · 15 GB Data Add-On\n• Disney+ (available with Unlimited plans)\n\nWhich one are you interested in?`,
              [
                { label: 'Global Calling Card — free', intent: null },
                { label: '5 GB Data Add-On — $10',     intent: null },
                { label: '15 GB Data Add-On — $20',    intent: null },
                { label: 'Tell me about Unlimited',     intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'start',
            contextPatch: {},
            endFlow:      false,
          };
        }

        // Default: show the points redemption offer
        return {
          response: msg(
            `You have ${pts} Rewards Points — enough to get the Global Calling Card completely free (1,000 pts).\n\nThe card covers 200+ countries at ~$0.02/min. At your call volume, that's about $18/mo in savings.\n\nWant the free one, or pay $10/mo instead?`,
            [
              { label: 'Yes — redeem 1,000 pts for free', intent: null },
              { label: 'Pay $10/mo instead',              intent: null },
              { label: 'Tell me more',                    intent: null },
              { label: 'See all calling options',         intent: null },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'start',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'confirm_redeem': {
        if (lower.includes('yes') || lower.includes('free') || lower.includes('confirm') ||
            lower.includes('get it') || lower.includes('redeem')) {
          return {
            response: `Redeeming 1,000 points for your Global Calling Card now.\n[INTERNATIONAL_FLOW]`,
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        if (lower.includes('pay $10') || lower.includes('pay instead') || lower.includes('$10')) {
          return {
            response: msg(
              `Sure — charging ${card} $10/mo.\n\n┌──────────────────────────────────────────────────────┐\n│  Global Calling Card — $10/mo                        │\n│  200+ countries · Auto-renews · Cancel anytime       │\n│  Charged to: ${card}                 │\n└──────────────────────────────────────────────────────┘\n\nConfirm?`,
              [
                { label: 'Confirm — $10/mo', intent: null },
                { label: 'Cancel',           intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'confirm_pay',
            contextPatch: { wantsPay: true },
            endFlow:      false,
          };
        }
        if (lower.includes('cancel') || lower.includes('not right now') || lower.includes('no')) {
          return {
            response: msg(
              `No problem. Your points will stay in your account. Just come back when you're ready — I'll have the same offer waiting.\n\nAnything else I can help with?`,
              [
                { label: 'Check my account',   intent: null   },
                { label: "That's it for now",   intent: 'done' },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        return null;
      }

      case 'confirm_pay': {
        if (lower.includes('confirm') || lower.includes('yes') || lower.includes('$10') || lower.includes('go ahead')) {
          return {
            response: `Setting up your Global Calling Card at $10/mo.\n[INTERNATIONAL_FLOW]`,
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        if (lower.includes('points') || lower.includes('free') || lower.includes('use points')) {
          return {
            response: msg(
              `Redeeming 1,000 pts for the Global Calling Card.\n\n┌────────────────────────────────────────────────────────┐\n│  Global Calling Card — FREE (1,000 pts)                │\n│  Value: $10/mo · 200+ countries                        │\n└────────────────────────────────────────────────────────┘\n\nConfirm?`,
              [
                { label: 'Yes — get it free', intent: null },
                { label: 'Cancel',            intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'confirm_redeem',
            contextPatch: { wantsRedeem: true },
            endFlow:      false,
          };
        }
        if (lower.includes('cancel') || lower.includes('no') || lower.includes('not right now')) {
          return {
            response: msg(
              `No problem. Your account is unchanged. Anything else I can help with?`,
              POST_FLOW_PILLS
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        return null;
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
