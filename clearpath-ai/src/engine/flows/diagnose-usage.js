// src/engine/flows/diagnose-usage.js
// Data usage diagnosis flow (Maria / Derek / generic)

import { msg, POST_FLOW_PILLS } from '../utils.js';

export const DiagnoseUsageFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();
    const a = persona?.account || {};

    switch (stepId) {

      case 'start':
        return {
          response: msg(
            `I can see you're mostly on cellular — only ${a.wifiUsagePercent || 22}% of your usage goes through Wi-Fi. Let's see if there's a free fix first.\n\nWant me to walk you through a couple of quick checks?`,
            [
              { label: "Let's do it",               intent: null           },
              { label: 'Skip — add 5 GB for $15',  intent: 'quick_refill' },
              { label: 'Skip — change my plan',    intent: 'plan_change'  },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'asked_wifi',
          contextPatch: {},
          endFlow:      false,
        };

      case 'asked_wifi':
        return {
          response: msg(
            `Are you connected to Wi-Fi when you're at home or at work?`,
            [
              { label: 'Yes, always',  intent: null },
              { label: 'Sometimes',    intent: null },
              { label: "I'm not sure", intent: null },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'asked_streaming',
          contextPatch: { wifiAnswer: userText },
          endFlow:      false,
        };

      case 'asked_streaming': {
        const wifiNote = lower.includes('sometimes') || lower.includes('not sure')
          ? `That could be it — when Wi-Fi is slow your phone silently switches to cellular.\n\n`
          : '';
        return {
          response: msg(
            `${wifiNote}Do you stream video or music on cellular — not just on Wi-Fi?`,
            [
              { label: 'Yes, often',   intent: null },
              { label: 'Occasionally', intent: null },
              { label: 'Rarely',       intent: null },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'asked_background',
          contextPatch: { streamingAnswer: userText },
          endFlow:      false,
        };
      }

      case 'asked_background': {
        const streamingNote = lower.includes('often') || lower.includes('occasionally')
          ? `That can use 1–3 GB per hour on HD.\n\n`
          : '';
        return {
          response: msg(
            `${streamingNote}Last one: do you have apps set to auto-update or sync in the background on cellular?`,
            [
              { label: 'Probably yes',      intent: null },
              { label: "I've disabled it",  intent: null },
              { label: 'Not sure',          intent: null },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'showing_fixes',
          contextPatch: { backgroundAnswer: userText },
          endFlow:      false,
        };
      }

      case 'showing_fixes':
        return {
          response: msg(
            `Here are three free fixes that could make a real difference:\n\n✅ Turn off "Wi-Fi Assist" in Settings — stops your phone from silently switching to cellular when Wi-Fi slows down\n✅ Set streaming apps to "Wi-Fi only" — YouTube and Netflix can each burn 1–3 GB per hour on HD over cellular\n✅ Disable Background App Refresh — Settings → General → Background App Refresh and turn it off for apps that don't need to stay current in the background\n\nWant to try these first? If they don't solve it, I can add data or change your plan in seconds.`,
            [
              { label: "I'll try those",         intent: 'try_free_fixes' },
              { label: 'Add data for now — $15', intent: 'quick_refill'   },
              { label: 'Show plan options',       intent: 'plan_change'    },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'flow_complete',
          contextPatch: {},
          endFlow:      true,
        };

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
