// src/engine/flows/activation.js
// SIM/eSIM activation flow (Nina us-010, James us-004, generic)

import { msg, POST_FLOW_PILLS } from '../utils.js';

export const ActivationFlow = {
  step(stepId, userText, ctx, persona) {
    const lower = userText.toLowerCase();
    const a = persona?.account || {};

    switch (stepId) {

      case 'start': {
        // Port number path
        if (lower.includes('port') || lower.includes('current number') ||
            lower.includes('existing') || lower.includes('keep')) {
          return {
            response: msg(
              `To keep your existing number, I'll need your current carrier name, account number, and PIN. Keep your old SIM in until the transfer completes — usually under 30 minutes.\n\nReady to start?`,
              [
                { label: 'Start port-in now',           intent: null },
                { label: 'I need to find my account info', intent: null },
                { label: 'Get a new number instead',    intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'port_number',
            contextPatch: { wantsPort: true },
            endFlow:      false,
          };
        }

        // New number path
        if (lower.includes('new number') || lower.includes('fresh') ||
            lower.includes('get a new')) {
          return {
            response: `[ACTIVATION_FLOW]`,
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: { wantsNewNumber: true },
            endFlow:      true,
          };
        }

        // eSIM-specific (James / device has eSIM)
        if (lower.includes('esim') || lower.includes('e-sim') ||
            (a.simType === 'eSIM' && lower.includes('activate'))) {
          return {
            response: msg(
              `eSIM is the fastest option — no physical SIM needed. First, let's pick your plan:\n\n• Total Base 5G — $20/mo (BYOP + AutoPay) · Unlimited\n• Total 5G Unlimited — See current price · Unlimited + Disney+\n• Total 5G+ — See current price · Unlimited + 50 GB hotspot`,
              [
                { label: 'Total Base 5G — $20/mo',   intent: null },
                { label: '5G Unlimited — See price', intent: null },
                { label: '5G+ — See price',          intent: null },
                { label: 'Help me decide',            intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'pick_plan',
            contextPatch: { simType: 'eSIM' },
            endFlow:      false,
          };
        }

        // Plan-first path
        if (lower.includes('plan') || lower.includes('help') || lower.includes('choose')) {
          return {
            response: msg(
              `Sure! The most popular option for a new phone is Total Base 5G Unlimited at $20/mo — unlimited data, talk, and text. No annual contract.\n\nOnce you pick a plan we'll start activation.`,
              [
                { label: 'Total Base 5G — $20/mo', intent: null },
                { label: 'See all plans',           intent: null },
                { label: 'Port my number',          intent: null },
                { label: 'Get a new number',        intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'pick_plan',
            contextPatch: {},
            endFlow:      false,
          };
        }

        // What does activation involve?
        if (lower.includes('what') || lower.includes('involve') || lower.includes('need')) {
          return {
            response: msg(
              `Activation is simple: pick your number preference, confirm your plan, and your SIM powers on. Takes about 5 minutes.\n\nReady to start?`,
              [
                { label: 'Port my current number', intent: null },
                { label: 'Get a new number',       intent: null },
                { label: 'Help me pick a plan',    intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'start',
            contextPatch: {},
            endFlow:      false,
          };
        }

        // Generic activation start
        return {
          response: `[ACTIVATION_FLOW]`,
          nextFlowId:   null,
          nextStepId:   'flow_complete',
          contextPatch: {},
          endFlow:      true,
        };
      }

      case 'port_number': {
        if (lower.includes('start') || lower.includes('yes') || lower.includes('port') || lower.includes('activate')) {
          return {
            response: `[ACTIVATION_FLOW]`,
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: {},
            endFlow:      true,
          };
        }
        if (lower.includes('new number') || lower.includes('get a new')) {
          return {
            response: `[ACTIVATION_FLOW]`,
            nextFlowId:   null,
            nextStepId:   'flow_complete',
            contextPatch: { wantsNewNumber: true },
            endFlow:      true,
          };
        }
        if (lower.includes('account info') || lower.includes('look') || lower.includes('find')) {
          return {
            response: msg(
              `No problem — take your time. Here's what you'll need:\n\n• Current carrier name\n• Account number (on your bill)\n• Account PIN\n\nCome back when you have those ready — I'll start the transfer.`,
              [
                { label: 'Start the transfer',      intent: null },
                { label: 'Get a new number instead', intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'port_number',
            contextPatch: {},
            endFlow:      false,
          };
        }
        return {
          response: msg(
            `Whenever you're ready, I can start the port-in or set up a new number instead.`,
            [
              { label: 'Start port-in now',       intent: null },
              { label: 'Get a new number instead', intent: null },
            ]
          ),
          nextFlowId: null, nextStepId: 'port_number', contextPatch: {}, endFlow: false,
        };
      }

      case 'pick_plan': {
        // Any plan selection triggers the activation flow
        if (lower.includes('base') || lower.includes('$20') || lower.includes('unlimited') ||
            lower.includes('5g+') || lower.includes('5g plus')) {
          return {
            response: msg(
              `Great choice. Now for a quick identity verification — this is a one-time step required by the carrier. It takes about 30 seconds.\n\nReady?`,
              [
                { label: "Yes, let's verify", intent: null },
                { label: 'What do I need?',   intent: null },
              ]
            ),
            nextFlowId:   null,
            nextStepId:   'verify_identity',
            contextPatch: {},
            endFlow:      false,
          };
        }
        return null;
      }

      case 'verify_identity': {
        return {
          response: msg(
            `Verification complete ✓\n\nYour number: (555) 214-8834\nPlan: Total Base 5G · Activates instantly\n\n🎉 340 Welcome Points added to your account.\n\nHere's how to install your eSIM on ${a.device || 'your phone'}:\n1. Go to Settings → Cellular → Add eSIM\n2. Tap "Use QR Code" and scan below\n[QR code sent to your email]\n\nYou're all set!`,
            [
              { label: 'Show me how to set up hotspot', intent: null },
              { label: 'Check my account',              intent: null },
              { label: "I'm done",                      intent: 'done' },
            ]
          ),
          nextFlowId:   null,
          nextStepId:   'flow_complete',
          contextPatch: {},
          endFlow:      true,
        };
      }

      case 'byop_start': {
        if (lower.includes('check') || lower.includes('imei') || lower.includes('compatible') || lower.includes('works')) {
          return {
            response: msg(
              `Good news — most unlocked phones work on our network. Your phone is compatible.\n\nWant to go ahead with activation?`,
              [
                { label: 'Yes, start activation',    intent: null },
                { label: 'Help me pick a plan',       intent: null },
                { label: 'Tell me about BYOP plans', intent: null },
              ]
            ),
            nextFlowId: null, nextStepId: 'start', contextPatch: {}, endFlow: false,
          };
        }
        return {
          response: msg(
            `Let's check your phone's compatibility — most unlocked phones work on our network. Do you know your IMEI, or want help finding it?`,
            [
              { label: 'Check compatibility now',   intent: null },
              { label: 'Help me find my IMEI',      intent: null },
              { label: 'Tell me about BYOP plans',  intent: null },
            ]
          ),
          nextFlowId: null, nextStepId: 'byop_start', contextPatch: {}, endFlow: false,
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
