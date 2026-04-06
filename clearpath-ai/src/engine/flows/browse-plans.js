// src/engine/flows/browse-plans.js
// Generic plan browsing flow

import { msg, POST_FLOW_PILLS } from '../utils.js';

export const BrowsePlansFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();
    const a = persona?.account || {};

    switch (stepId) {

      case 'start': {
        const intro = a.plan
          ? `You're currently on ${a.plan} at ${a.planPrice}. Here are all available plans:`
          : `Here are all available plans:`;
        return {
          response: `${intro}\n[RECOMMENDATIONS]${JSON.stringify([
            { type: 'plan', id: 'base-5g',          reason: 'Most affordable — 5 GB of 5G data at $20/mo. No contract, no surprises.', isBest: true  },
            { type: 'plan', id: '5g-unlimited',      reason: 'Unlimited data with no caps. Includes 15 GB hotspot and Disney+ Basic.',   isBest: false },
            { type: 'plan', id: '5g-plus-unlimited', reason: 'Our top tier — premium 5G speeds, 25 GB hotspot, and Disney+ Premium.',   isBest: false },
          ])}[/RECOMMENDATIONS]`,
          nextFlowId:   null,
          nextStepId:   'shown_plans',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'shown_plans': {
        // Handle follow-up questions after seeing plans
        if (lower.includes('unlimited') || lower.includes('upgrade') || lower.includes('switch')) {
          return {
            response: msg(
              `Total 5G Unlimited at $55/mo gives you unlimited data with no caps, 15 GB hotspot, Disney+ Basic, and Wi-Fi Calling.\n\nWant to upgrade now, or schedule it for your next renewal?`,
              [
                { label: 'Upgrade now — prorated',            intent: 'upgrade_now'        },
                { label: `Switch at renewal — free`,          intent: 'upgrade_at_renewal' },
                { label: 'Stay on my current plan',           intent: 'keep_plan'          },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }

        if (lower.includes('base') || lower.includes('cheapest') || lower.includes('affordable') || lower.includes('$20')) {
          return {
            response: msg(
              `Total Base 5G at $20/mo (with BYOP + AutoPay) is the most affordable option — unlimited talk & text plus 5 GB of 5G data. No annual contract.\n\nIs this the plan you'd like to go with?`,
              [
                { label: 'Switch to Base 5G',  intent: 'plan_change' },
                { label: 'Compare all plans', intent: 'compare'     },
                { label: 'Go back home',       intent: 'done'        },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }

        return {
          response: msg(`Is there anything else I can help with?`, POST_FLOW_PILLS),
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
