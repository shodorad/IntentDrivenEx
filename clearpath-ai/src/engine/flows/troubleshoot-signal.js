// src/engine/flows/troubleshoot-signal.js
// Angela's (us-005) full 7-step connectivity troubleshooting flow

import { msg, POST_FLOW_PILLS } from '../utils.js';

// ── Shared response builders ──────────────────────────────────────────────────

function step1RestartMsg(a) {
  return msg(
    `Network check complete:\n• Active outages in your area: None ✓\n• Root cause: Likely a device or settings issue\n\nI'll walk you through 4 quick fixes that resolve this 90% of the time. Step 1: have you restarted your ${a.device || 'phone'} recently?`,
    [
      { label: "Restarted, problem's still there", intent: null },
      { label: 'No — let me try now',              intent: null },
      { label: 'I restart it often',               intent: null },
    ]
  );
}

function step2IndoorMsg() {
  return msg(
    `Step 2: Is the issue worse indoors, or about the same everywhere?`,
    [
      { label: 'Worse indoors',  intent: null },
      { label: 'Same everywhere', intent: null },
      { label: 'Not sure',        intent: null },
    ]
  );
}

function step3IndoorAirplaneMsg() {
  return msg(
    `Building materials can block 1–2 bars of signal — that may explain it.\n\nQuick test:\n• Move to a window or step outside briefly\n• Check if signal improves (top bar on your screen)\n• This tells us: coverage gap vs device issue\n\nStep 3 while you test: toggle Airplane Mode on for 10 seconds, then off — this forces your phone to re-register with the nearest tower.\n\nHow does it look?`,
    [
      { label: 'Signal improves outside', intent: null },
      { label: 'Same outside too',        intent: null },
      { label: 'Airplane mode helped!',   intent: null },
      { label: 'Still the same',          intent: null },
    ]
  );
}

function step3GeneralAirplaneMsg() {
  return msg(
    `Step 3 — Airplane Mode reset:\n• Toggle Airplane Mode on for 10 seconds\n• Then toggle it back off\n• This forces your phone to re-register with the nearest tower\n\nDid that help?`,
    [
      { label: 'Yes, that helped!',         intent: null },
      { label: 'Done — still not working',  intent: null },
      { label: 'Already tried that',        intent: null },
    ]
  );
}

function step4SimReseatMsg(a) {
  return msg(
    `Step 4 — SIM card reseat:\n• Power off your ${a.device || 'phone'}\n• Remove the SIM tray and reseat the card firmly\n• Power back on — this forces a fresh network registration\n• Have eSIM? Skip this and tap "Already tried" below\n\nCan you try that?`,
    [
      { label: 'Done — still the same',    intent: null },
      { label: 'Fixed it!',                intent: null },
      { label: 'How do I do that?',        intent: null },
      { label: 'Already tried / eSIM',     intent: null },
    ]
  );
}

function maybeResolvedMsg() {
  return msg(
    `Great — sometimes all it takes is a fresh connection. Keep an eye on it over the next hour.\n\nIf it comes back, we can run through a few more steps. Anything else I can help with?`,
    [
      { label: 'It came back — keep going', intent: null },
      { label: "I'm good, thanks",          intent: null },
    ]
  );
}

function wifiCallingUpsellMsg() {
  return msg(
    `That confirms it — the issue is indoor coverage, not your device. Building materials are blocking the signal.\n\nThe permanent fix is Wi-Fi Calling: your phone routes calls through your home Wi-Fi when cellular is weak indoors. It's included in Total 5G Unlimited ($55/mo).\n\nWant me to show you the plan, or would you prefer to talk to our network team?`,
    [
      { label: 'Show plan with Wi-Fi Calling', intent: null },
      { label: 'Talk to support',              intent: null },
      { label: 'Schedule a callback',          intent: null },
    ]
  );
}

function escalateMsg() {
  return msg(
    `We've gone through all four standard fixes and none of them resolved it. At this point it may be a deeper coverage issue in your area.\n\nI can connect you with our network team who can run deeper diagnostics — or I can show you a plan option that might help in the meantime.\n\nWhat would you prefer?`,
    [
      { label: 'Show plan with Wi-Fi Calling', intent: null },
      { label: 'Talk to support',              intent: null },
      { label: 'Schedule a callback',          intent: null },
    ]
  );
}

function toLiveChatMsg() {
  return `I'll connect you with our network team right now — they can run deeper diagnostics on your account.\n\nLive chat wait time: ~4 minutes.\n[LIVE_CHAT_FLOW]`;
}

function wifiPlanDetailMsg() {
  return msg(
    `Total 5G Unlimited at $55/mo includes Wi-Fi Calling — your phone uses your home Wi-Fi for calls even when cellular is weak. That would solve most of your dropped call issues.\n\nThe change takes effect at your next billing cycle. Want me to schedule the upgrade?`,
    [
      { label: 'Yes, schedule the upgrade',         intent: null },
      { label: 'How much more is that?',            intent: null },
      { label: 'Let me think about it',             intent: null },
      { label: 'No thanks — just connect me to support', intent: null },
    ]
  );
}

// ── Flow object ───────────────────────────────────────────────────────────────

export const TroubleshootSignalFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();
    const a = persona?.account || {};

    switch (stepId) {

      // ── Entry / first turn after persona opening ──────────────────────────
      case 'start': {
        // User wants live chat immediately
        if (lower.includes('talk') || lower.includes('someone') || lower.includes('speak')) {
          const hour = new Date().getHours();
          const available = hour >= 8 && hour < 23.75;
          return {
            response: msg(
              available
                ? `Live chat is available now — wait time is about 4 minutes. Or I can schedule you a callback within 15 minutes.\n\nWhich works better for you?`
                : `Live chat is closed right now (closes at 11:45 PM EST). You can call 1-866-663-3633, or I can have an agent reach out to you first thing tomorrow morning.`,
              available
                ? [
                    { label: 'Start live chat now',         intent: null },
                    { label: 'Schedule callback in 15 min', intent: null },
                  ]
                : [
                    { label: 'Schedule callback tomorrow', intent: null },
                  ]
            ),
            nextFlowId:   null,
            nextStepId:   'asked_live_chat',
            contextPatch: {},
            endFlow:      false,
          };
        }

        // User wants to see plan/coverage options
        if (lower.includes('plan') || lower.includes('coverage') || lower.includes('better')) {
          return {
            response: `Good question — and coverage matters a lot when you're seeing dropped calls.\n\nYou're on ${a.plan || 'Total Base 5G'} right now. Here are plans that may help with your signal situation:\n[RECOMMENDATIONS]${JSON.stringify([
              { type: 'plan', id: '5g-unlimited',      reason: 'Includes Wi-Fi Calling — uses your home Wi-Fi for calls when cellular is weak. Best fix for dropped calls indoors.', isBest: true },
              { type: 'plan', id: '5g-plus-unlimited', reason: 'Premium 5G speeds with the highest network priority — better performance in congested areas.', isBest: false },
              { type: 'plan', id: 'base-5g',           reason: 'Your current plan tier — most affordable, but no Wi-Fi Calling.', isBest: false },
            ])}[/RECOMMENDATIONS]`,
            nextFlowId:   null,
            nextStepId:   'showed_coverage_plans',
            contextPatch: {},
            endFlow:      false,
          };
        }

        // Default: "Check for outages now", "Walk me through a fix", or any first turn → Step 1
        return {
          response: step1RestartMsg(a),
          nextFlowId:   null,
          nextStepId:   'asked_restart',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'asked_live_chat': {
        if (lower.includes('callback') || lower.includes('call back') || lower.includes('schedule')) {
          return {
            response: msg(
              `Done — a network specialist will call you back within 15 minutes at the number on your account.\n\nIn the meantime, if anything changes, come back here.`,
              [{ label: 'Go back home', intent: 'done' }]
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        if (lower.includes('live chat') || lower.includes('start chat')) {
          return {
            response: toLiveChatMsg(),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        // Changed mind — run the diagnosis instead
        return {
          response: step1RestartMsg(a),
          nextFlowId:   null,
          nextStepId:   'asked_restart',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'showed_coverage_plans': {
        if (lower.includes('talk') || lower.includes('support') || lower.includes('callback')) {
          return {
            response: toLiveChatMsg(),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        if (lower.includes('wifi calling') || lower.includes('wi-fi calling') || lower.includes('unlimited')) {
          return {
            response: wifiPlanDetailMsg(),
            nextFlowId:   null,
            nextStepId:   'showing_wifi_plan',
            contextPatch: {},
            endFlow:      false,
          };
        }
        // Asked to try a fix after seeing plans
        return {
          response: step1RestartMsg(a),
          nextFlowId:   null,
          nextStepId:   'asked_restart',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'asked_restart': {
        if (lower.startsWith('no') || lower.includes('let me try')) {
          return {
            response: msg(
              `Try it now and let me know how it goes — I'll wait.\n\nDid a restart help at all?`,
              [
                { label: 'Yes, that helped!',        intent: null },
                { label: 'Still having issues',       intent: null },
                { label: 'Helped briefly, came back', intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'waiting_for_restart',
            contextPatch: {},
            endFlow:      false,
          };
        }
        if ((lower.includes('helped') || lower.includes('yes')) &&
            !lower.includes('still') && !lower.includes('briefly') && !lower.includes('came back')) {
          return {
            response: maybeResolvedMsg(),
            nextFlowId:   null,
            nextStepId:   'maybe_resolved',
            contextPatch: {},
            endFlow:      false,
          };
        }
        // "Restarted, problem's still there" / "I restart it often" / anything else → Step 2
        return {
          response: step2IndoorMsg(),
          nextFlowId:   null,
          nextStepId:   'asked_indoor',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'waiting_for_restart': {
        if ((lower.includes('yes') || lower.includes('helped')) &&
            !lower.includes('still') && !lower.includes('not') && !lower.includes('briefly')) {
          return {
            response: maybeResolvedMsg(),
            nextFlowId:   null,
            nextStepId:   'maybe_resolved',
            contextPatch: {},
            endFlow:      false,
          };
        }
        return {
          response: step2IndoorMsg(),
          nextFlowId:   null,
          nextStepId:   'asked_indoor',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'maybe_resolved': {
        if (lower.includes('came back') || lower.includes('keep going') || lower.includes('still')) {
          return {
            response: step2IndoorMsg(),
            nextFlowId:   null,
            nextStepId:   'asked_indoor',
            contextPatch: {},
            endFlow:      false,
          };
        }
        return {
          response: msg(`Great — glad that's sorted! Come back if it happens again.\n\nAnything else I can help with?`, POST_FLOW_PILLS),
          nextFlowId:   null,
          nextStepId:   'flow_complete',
          contextPatch: {},
          endFlow:      true,
        };
      }

      case 'asked_indoor': {
        if (lower.includes('indoors') || lower.includes('worse')) {
          return {
            response: step3IndoorAirplaneMsg(),
            nextFlowId:   null,
            nextStepId:   'asked_airplane_indoor',
            contextPatch: { worseIndoors: true },
            endFlow:      false,
          };
        }
        // "Same everywhere" or "Not sure"
        return {
          response: step3GeneralAirplaneMsg(),
          nextFlowId:   null,
          nextStepId:   'asked_airplane_general',
          contextPatch: { worseIndoors: false },
          endFlow:      false,
        };
      }

      case 'asked_airplane_indoor': {
        if (lower.includes('improves') || lower.includes('signal improves')) {
          return {
            response: wifiCallingUpsellMsg(),
            nextFlowId:   null,
            nextStepId:   'upsell_wifi_calling',
            contextPatch: { confirmedIndoorIssue: true },
            endFlow:      false,
          };
        }
        if ((lower.includes('helped') || lower.includes('airplane mode helped')) &&
            !lower.includes('still') && !lower.includes('not')) {
          return {
            response: msg(
              `That's a good sign. The issue may clear up on its own as you move around. I'd suggest keeping an eye on it for the rest of the day.\n\nIf it comes back consistently, we can escalate to our network team who can run deeper diagnostics.\n\nAnything else I can help with?`,
              [
                { label: 'It keeps coming back', intent: null },
                { label: "I'm good, thanks",     intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'step3_helped',
            contextPatch: {},
            endFlow:      false,
          };
        }
        // "Same outside too" / "Still the same" / "Already tried" → Step 4
        return {
          response: step4SimReseatMsg(a),
          nextFlowId:   null,
          nextStepId:   'asked_sim_reseat',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'asked_airplane_general': {
        if ((lower.includes('yes') || lower.includes('helped')) &&
            !lower.includes('still') && !lower.includes('not')) {
          return {
            response: msg(
              `That's a good sign. The issue may clear up on its own as you move around. I'd suggest keeping an eye on it for the rest of the day.\n\nIf it comes back consistently, we can escalate to our network team who can run deeper diagnostics.\n\nAnything else I can help with?`,
              [
                { label: 'It keeps coming back', intent: null },
                { label: "I'm good, thanks",     intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'step3_helped',
            contextPatch: {},
            endFlow:      false,
          };
        }
        return {
          response: step4SimReseatMsg(a),
          nextFlowId:   null,
          nextStepId:   'asked_sim_reseat',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'step3_helped': {
        if (lower.includes('keeps coming back') || lower.includes('coming back') || lower.includes('still')) {
          return {
            response: step4SimReseatMsg(a),
            nextFlowId:   null,
            nextStepId:   'asked_sim_reseat',
            contextPatch: {},
            endFlow:      false,
          };
        }
        return {
          response: msg(`Great — glad that's sorted! Come back if it happens again.\n\nAnything else I can help with?`, POST_FLOW_PILLS),
          nextFlowId:   null,
          nextStepId:   'flow_complete',
          contextPatch: {},
          endFlow:      true,
        };
      }

      case 'asked_sim_reseat': {
        if ((lower.includes('fixed') || lower.includes('worked')) &&
            !lower.includes('still') && !lower.includes('not')) {
          return {
            response: msg(`Glad that did it! If you have any more issues, I'm right here.\n\nAnything else I can help with today?`, POST_FLOW_PILLS),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        if (lower.includes('how do i') || lower.includes('how to') ||
            (lower.includes('how') && !lower.includes('how much'))) {
          return {
            response: msg(
              `On Samsung Galaxy devices:\n\n✅ Power off your phone completely\n✅ Use a SIM ejector or paperclip to open the tray\n✅ Remove the SIM — check for dirt or damage\n✅ Place it back firmly in the tray\n✅ Reinsert the tray and power back on\n\nThat forces a fresh network registration. Did that help?`,
              [
                { label: 'Yes, fixed it!',  intent: null },
                { label: 'Still the same', intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'asked_sim_how',
            contextPatch: {},
            endFlow:      false,
          };
        }
        // "Done — still the same" / "Already tried / eSIM" → escalate
        return {
          response: escalateMsg(),
          nextFlowId:   null,
          nextStepId:   'escalating',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'asked_sim_how': {
        if ((lower.includes('fixed') || lower.includes('yes')) &&
            !lower.includes('still') && !lower.includes('not')) {
          return {
            response: msg(`Glad that did it! If you have any more issues, I'm right here.\n\nAnything else I can help with today?`, POST_FLOW_PILLS),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        return {
          response: escalateMsg(),
          nextFlowId:   null,
          nextStepId:   'escalating',
          contextPatch: {},
          endFlow:      false,
        };
      }

      case 'upsell_wifi_calling': {
        if (lower.includes('show plan') || lower.includes('wifi calling') || lower.includes('wi-fi calling')) {
          return {
            response: wifiPlanDetailMsg(),
            nextFlowId:   null,
            nextStepId:   'showing_wifi_plan',
            contextPatch: {},
            endFlow:      false,
          };
        }
        if (lower.includes('callback') || lower.includes('call back') || lower.includes('schedule')) {
          return {
            response: msg(
              `Done — a network specialist will call you back within 15 minutes at the number on your account.\n\nIn the meantime, if anything changes, come back here.`,
              [{ label: 'Go back home', intent: 'done' }]
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        return {
          response: toLiveChatMsg(),
          nextFlowId:   null,
          nextStepId:   'flow_complete',
          contextPatch: {},
          endFlow:      true,
        };
      }

      case 'showing_wifi_plan': {
        if (lower.includes('yes') || lower.includes('schedule') || lower.includes('switch')) {
          return {
            response: msg(
              `Done — your plan upgrade to Total 5G Unlimited ($55/mo) is scheduled for your next billing cycle. Wi-Fi Calling will activate automatically.\n\nIn the meantime, if you're in a weak signal area, connect to Wi-Fi and enable Wi-Fi Calling in your phone settings.\n\nAnything else I can help with?`,
              POST_FLOW_PILLS
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        if (lower.includes('how much') || lower.includes('more is that')) {
          return {
            response: msg(
              `It's $55/mo — that's $15 more than your current plan. Includes unlimited data, Wi-Fi Calling, 15 GB hotspot, and Disney+ Basic.\n\nWant to schedule the upgrade?`,
              [
                { label: 'Yes, schedule the upgrade',          intent: null },
                { label: 'No thanks — connect me to support', intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'showing_wifi_plan',
            contextPatch: {},
            endFlow:      false,
          };
        }
        return {
          response: toLiveChatMsg(),
          nextFlowId:   null,
          nextStepId:   'flow_complete',
          contextPatch: {},
          endFlow:      true,
        };
      }

      case 'escalating': {
        if (lower.includes('wifi calling') || lower.includes('wi-fi calling') || lower.includes('show plan')) {
          return {
            response: wifiPlanDetailMsg(),
            nextFlowId:   null,
            nextStepId:   'showing_wifi_plan',
            contextPatch: {},
            endFlow:      false,
          };
        }
        if (lower.includes('callback') || lower.includes('call back') || lower.includes('schedule')) {
          return {
            response: msg(
              `Done — a network specialist will call you back within 15 minutes at the number on your account.\n\nIn the meantime, if anything changes, come back here.`,
              [{ label: 'Go back home', intent: 'done' }]
            ),
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        // "Talk to support" or anything else → live chat
        return {
          response: toLiveChatMsg(),
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
