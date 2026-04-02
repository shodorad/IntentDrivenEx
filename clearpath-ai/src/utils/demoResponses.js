// Persona-aware demo responses (fallback when API is unavailable)
// R1: Never ask what the provider already knows. Reference account data directly.
// R2: Diagnose before selling. Free fixes first.
// R3: Ask permission before surfacing plan card / refill CTA / upsell.
// R4: Always give an escape hatch.
// R5: Sensible defaults everywhere.

// ─── Helpers ─────────────────────────────────────────────────────────────────
const msg = (t, pills) =>
  pills
    ? `${t}\n[ACTION_PILLS]${JSON.stringify(pills)}[/ACTION_PILLS]`
    : t;

// Standard pills shown after every flow completion
const POST_FLOW_PILLS = [
  { label: 'Ask something else', intent: 'show_options' },
  { label: 'Go back home',       intent: 'done'         },
  { label: "I'm done for now",   intent: 'done'         },
];

// Shared terminal response — shown when intent === 'done' or 'reset'
function getGenericDoneResponse() {
  return msg(
    `You're all set! Come back any time.\n\nIs there anything else before you go?`,
    [
      { label: 'One more thing',  intent: 'show_options' },
      { label: 'All done',        intent: 'reset'        },
    ]
  );
}

// Shared clarify response — shown when user types free text with no activeIntent at turn > 1
function getGenericClarifyResponse() {
  return msg(
    `I want to make sure I help with the right thing. Were you looking to:`,
    [
      { label: 'Add data now',          intent: 'quick_refill'   },
      { label: 'Understand my usage',   intent: 'diagnose_usage' },
      { label: 'Change my plan',        intent: 'plan_change'    },
      { label: 'Go back home',          intent: 'done'           },
    ]
  );
}

// S3-002: Detect if the user's first message came from a diagnose_usage action pill
// (pill.prompt === pill.label === exact English label of the suggestedAction)
function isDiagnoseAction(firstMsg, persona) {
  if (!persona?.diagnosisFlow?.enabled) return false;
  const lower = firstMsg.toLowerCase();
  return (persona.suggestedActions || []).some(
    (a) => a.action === 'diagnose_usage' && lower === a.label.toLowerCase()
  );
}

// S3-002: Return diagnosisFlow.intro response for diagnose_usage Turn 1
function getDiagnoseUsageResponse(persona) {
  const flow = persona.diagnosisFlow;
  const skipLabel  = persona.intentCategory === 'upgrade'
    ? 'Skip — show upgrade options'
    : 'Skip — add 5 GB for $15';
  const skipIntent = persona.intentCategory === 'upgrade' ? 'upgrade_now' : 'quick_refill';
  return msg(flow.intro, [
    { label: "Let's do it",            intent: null             },
    { label: skipLabel,                intent: skipIntent       },
    { label: 'Skip — change my plan',  intent: 'plan_change'   },
  ]);
}

// ─── Persona-specific opening responses (Turn 1) ─────────────────────────────
function getPersonaOpeningResponse(persona) {
  const a = persona?.account;
  if (!a) return null;

  switch (persona.id) {
    case 'us-001': // Maria — recurring data problem
      return msg(
        `Hi Maria. You have ${a.dataRemaining} left and ${a.daysUntilRenewal} days until your plan renews on ${a.renewalDate}.\n\nOne thing I noticed: only 22% of your usage goes through Wi-Fi — your phone is using cellular most of the time, even when you might not need to.\n\nThat's worth looking at before spending anything. Want me to walk you through a couple of quick fixes, or add data right now?`,
        [
          { label: 'Why am I running out?', intent: 'diagnose_usage' },
          { label: 'Quick Refill — $15',   intent: 'quick_refill'   },
          { label: 'Change my plan',        intent: 'plan_change'    },
          { label: "I'm fine for now",      intent: 'done'           },
        ]
      );

    case 'us-002': // Carlos — plan expiring in 2 days
      return msg(
        `Hey Carlos. Your plan expires in ${a.daysUntilRenewal} days — on ${a.renewalDate}. Service will pause if it's not renewed.\n\nYou're currently on ${a.plan} at ${a.planPrice}. Want to renew the same plan, or change while you're here?`,
        [`Renew ${a.plan} — ${a.planPrice}`, 'See other plans', 'Upgrade to Unlimited', 'Remind me tomorrow']
      );

    case 'us-003': // Priya — rewards redeemable
      return msg(
        `Hi Priya. You're down to ${a.dataRemaining} left — and you have ${a.rewardsPoints} Rewards Points on your account, which is enough to get a free 5 GB data add-on.\n\nWould you like to use your points for the free add-on, or pay for a refill instead?`,
        ['Redeem 1,000 pts — free 5 GB', 'Add 5 GB of data — $10', 'Renew full plan early — $40', 'Save my points for later']
      );

    case 'us-004': // James — new customer, eSIM
      return msg(
        `Welcome to Total Wireless, ${persona.name.split(' ')[0]}! Let's get you connected — this usually takes about 3 minutes.\n\nI can see you have an ${a.device}, so eSIM is the fastest option. Does that work for you, or would you prefer a physical SIM?`,
        [`Activate eSIM on ${a.device}`, 'Physical SIM instead', 'Port my number from another carrier', 'Help me choose a plan first']
      );

    case 'us-005': // Angela — persistent connectivity issues
      return msg(
        `Hi Angela. I can see you've reached out ${a.supportCallsThisMonth} this month — I'm sorry this is still happening.\n\n📊 ${a.supportCallsThisMonth} | support calls this month | warn\n📊 ${a.avgSignalBars} / 5 bars | avg signal | critical\n📊 ${a.droppedCallsThisWeek} dropped calls | this week | critical\n\nThat's a pattern, not a one-off. Let me check for a known outage in your area first — that's the fastest thing to rule out.`,
        ['Check for outages now', 'Walk me through a fix', 'Just talk to someone', 'Is there a plan with better coverage?']
      );

    case 'us-006': // Derek — hit cap 3rd month in a row
      return msg(
        `You've hit your data cap ${a.capHitsLast3Months} months in a row — and right now you're at 0 GB. Unlimited is only $15 more per month and ends the caps permanently.\n\nWere you thinking about upgrading, or want to understand why this keeps happening first?`,
        ['Why do I keep hitting my cap?', 'Upgrade to Unlimited', 'Start at next renewal (no charge today)', 'Just add 5 GB for now — $10']
      );

    case 'us-007': // Ana — international caller
      return msg(
        `Hi Ana. I can see you called Colombia 8 times this month and Mexico twice — you're paying per-minute rates right now, around $28 this month.\n\nThe $10/mo Global Calling Card covers 200+ countries and would save you about $18/mo at your call volume.\n\nBest part — you have ${a.rewardsPoints} Rewards Points. You could actually get the Calling Card completely free (1,000 pts). Want the free one?`,
        ['Yes — redeem 1,000 pts for free', 'Pay $10/mo instead', 'Tell me more', 'See all calling options']
      );

    case 'us-008': // Robert — 4-line family comparing plans
      return msg(
        `Hey Robert. You've checked Plans a few times this week — looks like you're thinking it over. Let me make it easy.\n\nYou're managing ${a.familyLines} lines, all on ${a.plan} at $${a.currentMonthlySpend}/mo total. Here's the thing: Unlimited at 4 lines is $110/mo — that's $50/mo cheaper, and each line gets unlimited data.\n\nWant to see the full side-by-side?`,
        ['See full plan comparison', 'Upgrade to 5G Unlimited — save $50/mo', 'Calculate 4-line pricing', 'Not ready to switch']
      );

    case 'us-009': // Alex — buy a new phone
      return msg(
        `Hey Alex. Good news — with your Total Unlimited plan, you qualify for some of our best device deals right now. A few phones are completely free, no trade-in needed.\n\nYour ${a.device} is 3 years old — there are some significant upgrades available. What kind of phone are you looking for?`,
        ['Show me new phones', 'I want an iPhone', 'I want a Samsung', 'What deals do I qualify for?']
      );

    case 'us-010': // Nina — new activation with Moto G Stylus 2025
      return msg(
        `Hi Nina! Let's get your Moto G Stylus 2025 connected — this usually takes about 5 minutes.\n\nI can see you have a physical SIM. Before we start: are you bringing your current number from another carrier, or would you like a fresh new number?`,
        ['Port my current number', 'Get a new number', 'Help me pick a plan first', 'What does activation involve?']
      );

    default: {
      // Generic opening by intentCategory
      switch (persona.intentCategory) {
        case 'refill':
          return msg(
            `I can see your data is running low — ${a.dataRemaining} left with ${a.daysUntilRenewal} days until your cycle resets. Before I set anything up — does this tend to happen most months, or is this a one-time thing?`,
            ['It happens most months', 'Just this once', 'I need data right now', "I'm not sure"]
          );
        case 'upgrade':
          return msg(
            `You've hit your data cap — and it looks like this has happened before. Upgrading to Unlimited ends the caps permanently.\n\nWant to upgrade now or just explore your options?`,
            ['Upgrade to Unlimited', 'Start at next renewal', "Tell me what's included", 'Not right now']
          );
        case 'byop':
          return msg(
            `Let's check if your phone works on Total Wireless. Most unlocked phones do — it usually takes about 30 seconds to confirm.\n\nDo you know your phone's IMEI number, or would you like help finding it?`,
            ['Check compatibility now', 'Help me find my IMEI', 'Tell me about BYOP plans', 'I have questions first']
          );
        case 'activate':
          return msg(
            `Great — let's get you connected. Activation usually takes about 5 minutes.\n\nFirst question: are you bringing your current phone number, or would you like a new one?`,
            ['Port my current number', 'Get a new number', 'Help me pick a plan first', 'What do I need to activate?']
          );
        default:
          return null;
      }
    }
  }
}

// ─── Per-persona multi-turn flow handlers ────────────────────────────────────

function getMariaTurnResponse(userMsgs, intentTurn, activeIntent, persona) {
  const a = persona?.account || {};
  const latest = (userMsgs[userMsgs.length - 1]?.content || '').toLowerCase();

  switch (activeIntent) {

    // ── DIAGNOSE USAGE FLOW ──────────────────────────────────────────
    case 'diagnose_usage':
      return getMariaDiagnoseResponse(latest, intentTurn, a);

    // ── QUICK REFILL FLOW ────────────────────────────────────────────
    case 'quick_refill':
      return getMariaRefillResponse(latest, intentTurn, a);

    // ── ADD DATA FLOW ────────────────────────────────────────────────
    case 'add_data':
      return getMariaAddDataResponse(latest, intentTurn, a);

    // ── PLAN CHANGE FLOW ─────────────────────────────────────────────
    case 'plan_change':
      return getMariaPlanResponse(latest, intentTurn, a);

    // ── UPGRADE NOW ──────────────────────────────────────────────────
    case 'upgrade_now':
      return msg(
        `Switching you to Total 5G Unlimited now.\n\n┌─────────────────────────────────────────────┐\n│  Total 5G Unlimited                         │\n│  $55/mo  (was $40/mo)                       │\n│  Prorated today: ~$7.14 (14 days left)      │\n│  Charged to: ${a.savedCard || 'card on file'}                 │\n└─────────────────────────────────────────────┘\n\nConfirm?`,
        [
          { label: 'Yes — upgrade now',         intent: 'confirm_upgrade'   },
          { label: 'Switch at renewal instead', intent: 'upgrade_at_renewal' },
          { label: 'Cancel',                    intent: 'cancel'             },
        ]
      );

    // ── UPGRADE AT RENEWAL ───────────────────────────────────────────
    case 'upgrade_at_renewal':
      return msg(
        `Done — your upgrade to Total 5G Unlimited is scheduled for ${a.renewalDate || 'your next renewal'}. Nothing to pay today.\n\nWant me to add 5 GB now to cover you until then?`,
        [
          { label: 'Yes — add 5 GB for $15', intent: 'quick_refill' },
          { label: "I'll manage",             intent: 'done'          },
        ]
      );

    // ── KEEP PLAN ────────────────────────────────────────────────────
    case 'keep_plan':
      return msg(
        `No problem. You're staying on Total Base 5G. If you need data before ${a.renewalDate || 'your renewal'}, come back and I can add it in seconds.\n\nAnything else I can help with?`,
        [
          { label: 'Add data now — $15', intent: 'quick_refill' },
          { label: 'Go back home',       intent: 'done'          },
        ]
      );

    // ── CONFIRM UPGRADE ──────────────────────────────────────────────
    case 'confirm_upgrade':
      return `Confirming your plan upgrade now.\n[UPGRADE_FLOW]`;

    // ── CONFIRM REFILL ───────────────────────────────────────────────
    case 'confirm_refill':
      return `Confirming now.\n[REFILL_FLOW]`;

    // ── SHOW OPTIONS ─────────────────────────────────────────────────
    case 'show_options':
      return msg(
        `Here are your options:\n\n• Add 5 GB for $15 — activates instantly, keeps your current plan\n• Upgrade to Unlimited — $55/mo, no more caps, includes Disney+\n• Wait until ${a.renewalDate || 'your renewal'} — your plan renews soon`,
        [
          { label: 'Add 5 GB — $15',      intent: 'quick_refill' },
          { label: 'Switch to Unlimited', intent: 'plan_change'  },
          { label: "I'll wait",            intent: 'cancel'       },
        ]
      );

    // ── CANCEL ───────────────────────────────────────────────────────
    case 'cancel':
      return msg(
        `No problem. Is there anything else I can help you with?`,
        [
          { label: 'Why am I running out?', intent: 'diagnose_usage' },
          { label: 'Quick Refill — $15',   intent: 'quick_refill'   },
          { label: 'Go back home',          intent: 'done'           },
        ]
      );

    // ── TRY FREE FIXES ───────────────────────────────────────────────
    case 'try_free_fixes':
      return msg(
        `Great call. Here's a recap of the three fixes to try:\n\n1. Settings → turn off "Wi-Fi Assist"\n2. YouTube/Netflix → set to "Wi-Fi only"\n3. Settings → General → Background App Refresh → off\n\nIf you run out before ${a.renewalDate || 'your renewal'}, come back and I can add data instantly.\n\nAnything else?`,
        [
          { label: 'Add data anyway — $15', intent: 'quick_refill' },
          { label: 'Go back home',           intent: 'done'          },
        ]
      );

    // ── DONE ─────────────────────────────────────────────────────────
    case 'done':
      return msg(
        `You're all set. Come back any time!\n\nIs there anything else before you go?`,
        [
          { label: 'One more thing', intent: 'show_options' },
          { label: 'Go back home',   intent: 'reset'        },
        ]
      );

    default:
      return null;
  }
}

// ── DIAGNOSIS SUB-FLOW ───────────────────────────────────────────────────────
function getMariaDiagnoseResponse(latest, intentTurn, a) {
  // intentTurn 0: Intro — surface the Wi-Fi stat
  if (intentTurn === 0) {
    return msg(
      `I can see you're mostly on cellular — only ${a.wifiUsagePercent || 22}% of your usage goes through Wi-Fi. Let's see if there's a free fix first.\n\nWant me to walk you through a couple of quick checks?`,
      [
        { label: "Let's do it",              intent: null          },
        { label: 'Skip — add 5 GB for $15', intent: 'quick_refill' },
        { label: 'Skip — change my plan',   intent: 'plan_change'  },
      ]
    );
  }

  // intentTurn 1: Wi-Fi question — all answers continue the diagnose flow
  if (intentTurn === 1) {
    return msg(
      `Are you connected to Wi-Fi when you're at home or at work?`,
      [
        { label: 'Yes, always',  intent: null },
        { label: 'Sometimes',    intent: null },
        { label: "I'm not sure", intent: null },
      ]
    );
  }

  // intentTurn 2: Streaming question — all answers continue the diagnose flow
  if (intentTurn === 2) {
    const wifiNote = latest.includes('sometimes') || latest.includes('not sure')
      ? `That could be it — when Wi-Fi is slow your phone silently switches to cellular.\n\n`
      : '';
    return msg(
      `${wifiNote}Do you stream video or music on cellular — not just on Wi-Fi?`,
      [
        { label: 'Yes, often',   intent: null },
        { label: 'Occasionally', intent: null },
        { label: 'Rarely',       intent: null },
      ]
    );
  }

  // intentTurn 3: Background apps — all answers continue the diagnose flow
  if (intentTurn === 3) {
    const streamingNote = latest.includes('often') || latest.includes('occasionally')
      ? `That can use 1–3 GB per hour on HD.\n\n`
      : '';
    return msg(
      `${streamingNote}Last one: do you have apps set to auto-update or sync in the background on cellular?`,
      [
        { label: 'Probably yes',    intent: null },
        { label: "I've disabled it", intent: null },
        { label: 'Not sure',         intent: null },
      ]
    );
  }

  // intentTurn 4+: Show free fixes — exit pills leave the flow
  return msg(
    `Here are three free fixes that could make a real difference:\n\n✅ Turn off "Wi-Fi Assist" in Settings — stops your phone from silently switching to cellular when Wi-Fi slows down\n✅ Set streaming apps to "Wi-Fi only" — YouTube and Netflix can each burn 1–3 GB per hour on HD over cellular\n✅ Disable Background App Refresh — Settings → General → Background App Refresh and turn it off for apps that don't need to stay current in the background\n\nWant to try these first? If they don't solve it, I can add data or change your plan in seconds.`,
    [
      { label: "I'll try those",         intent: 'try_free_fixes' },
      { label: 'Add data for now — $15', intent: 'quick_refill'   },
      { label: 'Show plan options',       intent: 'plan_change'    },
    ]
  );
}

// ── REFILL SUB-FLOW ──────────────────────────────────────────────────────────
function getMariaRefillResponse(latest, intentTurn, a) {
  // intentTurn 0: Confirm details
  if (intentTurn === 0) {
    return msg(
      `Want to add 5 GB right now for $15? I'll charge your ${a.savedCard || 'card on file'}. Takes about 2 seconds.`,
      [
        { label: 'Yes — do it',        intent: 'confirm_refill' },
        { label: 'Show other options', intent: 'show_options'   },
        { label: 'Cancel',             intent: 'cancel'         },
      ]
    );
  }
  // intentTurn 1+: free-text continuation → trigger flow
  return `Adding 5 GB to your account…\n[REFILL_FLOW]`;
}

// ── ADD DATA SUB-FLOW ────────────────────────────────────────────────────────
function getMariaAddDataResponse(latest, intentTurn, a) {
  if (intentTurn === 0) {
    return msg(
      `Want to add 5 GB for $10? I'll charge your ${a.savedCard || 'card on file'}. Activates instantly.`,
      [
        { label: 'Yes — do it', intent: 'confirm_refill' },
        { label: 'Cancel',      intent: 'cancel'         },
      ]
    );
  }
  return `Adding 5 GB to your account…\n[REFILL_FLOW]`;
}

// ── PLAN CHANGE SUB-FLOW ─────────────────────────────────────────────────────
function getMariaPlanResponse(latest, intentTurn, a) {
  if (intentTurn === 0) {
    return msg(
      `Based on your usage, you've needed more than 5 GB almost every month. Here's what would stop this from happening again:\n\n**Total 5G Unlimited** — $55/mo\n✓ Unlimited data (no more running out)\n✓ 10 GB hotspot\n✓ Disney+ included\n✓ Wi-Fi Calling\n\nThat's $15 more than your current plan.\n\nYou could start now — you'd only pay ~$7.14 today (prorated). Or switch at your next renewal on ${a.renewalDate || 'your renewal date'} with no charge today.`,
      [
        { label: 'Start now — ~$7 today',                         intent: 'upgrade_now'        },
        { label: `Switch on ${a.renewalDate || 'renewal'} — free`, intent: 'upgrade_at_renewal' },
        { label: 'Stay on my current plan',                        intent: 'keep_plan'          },
      ]
    );
  }
  // Free-text continuation
  return msg(
    `Would you like to upgrade now or wait until your renewal on ${a.renewalDate || 'your renewal date'}?`,
    [
      { label: 'Upgrade now — ~$7 today',   intent: 'upgrade_now'        },
      { label: 'Wait until renewal — free', intent: 'upgrade_at_renewal' },
      { label: 'Never mind',                intent: 'cancel'              },
    ]
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function getCarlosTurnResponse(userMsgs, turn, persona) {
  const a    = persona?.account || {};
  const _first = userMsgs[0]?.content?.toLowerCase() || '';
  const prev  = userMsgs[turn - 2]?.content?.toLowerCase() || '';

  if (turn === 2) {
    if (prev.includes('renew') && !prev.includes('unlimited')) {
      // AutoPay upsell before confirming renewal
      return msg(
        `Before I confirm — you could save $5/mo ($60/year) by enabling AutoPay. Want to add that now?\n\n┌──────────────────────────────────────────┐\n│  Total Base 5G renewal                   │\n│  $40/mo  →  $35/mo with AutoPay          │\n│  Charged to: ${a.savedCard || 'Mastercard ••••8810'}          │\n└──────────────────────────────────────────┘`,
        ['Yes — add AutoPay + save $5', 'No — just renew at $40', 'Cancel']
      );
    }
    if (prev.includes('upgrade') || prev.includes('unlimited')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (prev.includes('see other') || prev.includes('options') || prev.includes('show')) {
      return msg(
        `Here are your options. Your data balance looks fine (${a.dataRemaining} left), so this is really about whether you want more room going forward:\n\n• Total Base 5G  $20/mo (BYOP + Auto Pay) · Unlimited  ← Most affordable\n• 5G Unlimited   See current price · Unlimited + Disney+\n• 5G+ Unlimited  See current price · Unlimited + 50 GB hotspot\n\nWhich one feels right?`,
        ['Stay on Base — $20/mo', 'Go Unlimited — see price', 'Go 5G+ — see price', 'Compare features']
      );
    }
    if (prev.includes('remind') || prev.includes('tomorrow')) {
      return `I'll remind you. Just note that service pauses on ${a.renewalDate} if not renewed — tomorrow you'll have about 24 hours. I'll send you a heads-up.\n\nAnything else I can help with?`;
    }
  }

  if (turn === 3) {
    if (prev.includes('autopay') || prev.includes('save $5') || prev.includes('just renew') || prev.includes('renew at $40')) {
      return `Great — renewing now.\n[REFILL_FLOW]`;
    }
    if (prev.includes('base') || prev.includes('$40') || prev.includes('stay')) {
      return `Renewing your Total Base 5G now.\n[REFILL_FLOW]`;
    }
    if (prev.includes('unlimited') || prev.includes('$55') || prev.includes('$65')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
  }

  if (turn >= 4) {
    if (prev.includes('confirm') || prev.includes('yes') || prev.includes('go ahead')) {
      return `[REFILL_FLOW]`;
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

function getPriyaTurnResponse(userMsgs, turn, persona) {
  const a    = persona?.account || {};
  const _first = userMsgs[0]?.content?.toLowerCase() || '';
  const prev  = userMsgs[turn - 2]?.content?.toLowerCase() || '';

  if (turn === 2) {
    if (prev.includes('redeem') || prev.includes('free') || prev.includes('pts')) {
      return msg(
        `Great timing. Redeeming 1,000 pts for a free 5 GB add-on.\n\n┌──────────────────────────────────────────────────┐\n│  5 GB Data Add-On                                │\n│  Value: $15    Your cost: $0 (1,000 pts)         │\n│  Activates instantly                             │\n│  20 pts remaining after redemption               │\n└──────────────────────────────────────────────────┘\n\nWant to go ahead?`,
        ['Yes — redeem for free', 'Pay $15 instead', 'Save points for later']
      );
    }
    if (prev.includes('pay $15') || prev.includes('data add-on')) {
      return msg(
        `Sure — I'll keep your points.\n\n┌─────────────────────────────────┐\n│  5 GB Data Add-On — $15         │\n│  Activates instantly             │\n│  Charged to: ${a.savedCard || 'Visa ••••3377'}   │\n└─────────────────────────────────┘\n\nConfirm?`,
        ['Confirm — charge $15', 'Cancel']
      );
    }
    if (prev.includes('renew') || prev.includes('$40') || prev.includes('early')) {
      return msg(
        `Renewing ${a.plan} now at ${a.planPrice}.\n\n┌─────────────────────────────────────┐\n│  ${a.plan}               │\n│  ${a.planPrice} · Charged to ${a.savedCard || 'Visa ••••3377'}  │\n└─────────────────────────────────────┘\n\nConfirm?`,
        ['Confirm renewal', 'Cancel']
      );
    }
    if (prev.includes('save') || prev.includes('later')) {
      return msg(
        `No problem. Do you still want to add data? You're at ${a.dataRemaining} — you may run out before ${a.renewalDate}.`,
        ['Add 5 GB — $15', "I'll be fine"]
      );
    }
  }

  if (turn === 3) {
    if (prev.includes('yes') || prev.includes('redeem') || prev.includes('confirm') || prev.includes('charge')) {
      return `Processing now.\n[REFILL_FLOW]`;
    }
    if (prev.includes('add 5 gb') || prev.includes('$15')) {
      return `Got it.\n[REFILL_FLOW]`;
    }
    if (prev.includes("i'll be fine") || prev.includes('fine')) {
      return msg(
        `No problem. If you need data before ${a.renewalDate}, I'm right here.\n\nAnything else I can help with?`,
        ['Add data later', "That's it for now"]
      );
    }
  }

  if (turn >= 4 && (prev.includes('yes') || prev.includes('confirm') || prev.includes('go ahead'))) {
    return `[REFILL_FLOW]`;
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

function getJamesTurnResponse(userMsgs, turn, persona) {
  const a    = persona?.account || {};
  const _first = userMsgs[0]?.content?.toLowerCase() || '';
  const prev  = userMsgs[turn - 2]?.content?.toLowerCase() || '';

  if (turn === 2) {
    if (prev.includes('esim') || prev.includes("let's go") || prev.includes('activate')) {
      return msg(
        `First, pick your plan. You can always change it later:\n\n• Total Base 5G      $20/mo with BYOP + Auto Pay · Unlimited\n• Total 5G Unlimited — See current price · Unlimited + Disney+\n• Total 5G+          — See current price · Unlimited + 50 GB hotspot`,
        ['Total Base 5G — $20/mo', '5G Unlimited — See price', '5G+ — See price', 'Help me decide']
      );
    }
    if (prev.includes('port') || prev.includes('number') || prev.includes('carrier')) {
      return msg(
        `I can transfer your existing number. I'll need a few things from your current carrier:\n\n• Carrier name\n• Account number\n• Account PIN or transfer PIN\n\nYour current service will stay active during the transfer — no gap in coverage.\n\nDo you have those handy?`,
        ['Yes, I have them', 'Need to look them up', 'Get a new number instead']
      );
    }
    if (prev.includes('physical') || prev.includes('sim')) {
      return msg(
        `Physical SIM, no problem. I'll select your plan first, then we'll get your SIM card shipped.\n\nWhich plan works for you?`,
        ['Total Base 5G — $20/mo', '5G Unlimited — See price', 'Help me choose']
      );
    }
    if (prev.includes('plan') || prev.includes('help me choose')) {
      return msg(
        `Here are the plans:\n\n• Total Base 5G      $20/mo (BYOP + Auto Pay) — Unlimited. Best value for BYOP.\n• Total 5G Unlimited — See current price — Unlimited + Disney+. Best if you stream or use a hotspot.\n• Total 5G+          — See current price — Unlimited + 50 GB hotspot. Best for heavy hotspot use.\n\nWhat sounds right?`,
        ['Total Base 5G — $20/mo', '5G Unlimited — See price', '5G+ — See price']
      );
    }
  }

  if (turn === 3) {
    if (prev.includes('base') || prev.includes('$40') || prev.includes('$55') || prev.includes('$65') || prev.includes('unlimited') || prev.includes('5g')) {
      return msg(
        `Great choice. Now for a quick identity verification — this is a one-time step required by the carrier. It takes about 30 seconds.\n\nReady?`,
        ["Yes, let's verify", 'What do I need?']
      );
    }
    if (prev.includes('yes') || prev.includes('handy') || prev.includes('have them')) {
      return msg(
        `Great. I'll need:\n\n• Current carrier name\n• Account number (on your bill)\n• Account PIN\n\nHave those ready and I'll start the transfer.`,
        ['Start the transfer', 'Get a new number instead']
      );
    }
  }

  if (turn === 4) {
    if (prev.includes('verify') || prev.includes('yes') || prev.includes('ready')) {
      return msg(
        `Verification complete ✓\n\nYour number: (555) 214-8834\nPlan: Total Base 5G · Activates instantly\n\n🎉 340 Welcome Points added to your account.\n\nHere's how to install your eSIM on ${a.device}:\n1. Go to Settings → Cellular → Add eSIM\n2. Tap "Use QR Code" and scan below\n[QR code sent to your email]\n\nYou're all set!`,
        ['Show me how to set up hotspot', 'Check my account', "I'm done"]
      );
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

function getAngelaTurnResponse(userMsgs, turn, persona) {
  const a    = persona?.account || {};
  const _first = userMsgs[0]?.content?.toLowerCase() || '';
  const prev  = userMsgs[turn - 2]?.content?.toLowerCase() || '';

  // Helper: check if user is in a fix-step branch
  const _inDiagnosis = !prev.includes('talk to') && !prev.includes('speak with') && !prev.includes('just talk') && !prev.includes('support');

  if (turn === 2) {
    const current = userMsgs[turn - 1]?.content?.toLowerCase() || '';
    if (current.includes('talk') || current.includes('someone') || current.includes('speak')) {
      const hour = new Date().getHours();
      const available = hour >= 8 && hour < 23.75;
      return msg(
        available
          ? `Live chat is available now — wait time is about 4 minutes. Or I can schedule you a callback within 15 minutes.\n\nWhich works better for you?`
          : `Live chat is closed right now (closes at 11:45 PM EST). You can call 1-866-663-3633, or I can have an agent reach out to you first thing tomorrow morning.`,
        available
          ? ['Start live chat now', 'Schedule callback in 15 min', 'Call 1-866-663-3633']
          : ['Schedule callback tomorrow', 'Call now — 1-866-663-3633']
      );
    }
    if (current.includes('plan') || current.includes('coverage') || current.includes('better')) {
      return `Good question — and coverage matters a lot when you're seeing dropped calls.\n\nYou're on ${a.plan || 'Total Base 5G'} right now. Here are plans that may help with your signal situation:\n[RECOMMENDATIONS]${JSON.stringify([
        { type: 'plan', id: '5g-unlimited',      reason: 'Includes Wi-Fi Calling — uses your home Wi-Fi for calls when cellular is weak. Best fix for dropped calls indoors.', isBest: true },
        { type: 'plan', id: '5g-plus-unlimited', reason: 'Premium 5G speeds with the highest network priority — better performance in congested areas.', isBest: false },
        { type: 'plan', id: 'base-5g',           reason: 'Your current plan tier — most affordable, but no Wi-Fi Calling.', isBest: false },
      ])}[/RECOMMENDATIONS]`;
    }
    // Outage check / walk through a fix / general
    return msg(
      `Network check complete:\n• Active outages in your area: None ✓\n• Root cause: Likely a device or settings issue\n\nI'll walk you through 4 quick fixes that resolve this 90% of the time. Step 1: have you restarted your ${a.device || 'phone'} recently?`,
      ['Restarted, problem\'s still there', 'No — let me try now', 'I restart it often']
    );
  }

  if (turn === 3) {
    const current3 = userMsgs[turn - 1]?.content?.toLowerCase() || '';
    if (current3.includes('live chat') || current3.includes('start chat') || current3.includes('callback') || current3.includes('call back') || current3.includes('request callback')) {
      return `Connecting you now — Jordan M. will be with you in about 4 minutes.\n[LIVE_CHAT_FLOW]`;
    }
    if (current3.startsWith('no') || current3.includes('let me try')) {
      return msg(
        `Try it now and let me know how it goes — I'll wait.\n\nDid a restart help at all?`,
        ['Yes, that helped!', 'Still having issues', 'Helped briefly, came back']
      );
    }
    if (current3.includes('helped') && !current3.includes('still') && !current3.includes('briefly')) {
      return msg(
        `Great — sometimes all it takes is a fresh connection. Keep an eye on it over the next hour.\n\nIf it comes back, we can run through a few more steps. Anything else I can help with?`,
        ['It came back — keep going', "I'm good, thanks"]
      );
    }
    // Still having issues / restarted but still broken → Step 2
    return msg(
      `Step 2: Is the issue worse indoors, or about the same everywhere?`,
      ['Worse indoors', 'Same everywhere', 'Not sure']
    );
  }

  if (turn === 4) {
    const current4 = userMsgs[turn - 1]?.content?.toLowerCase() || '';
    // User is responding to "Did a restart help?" → still broken or came back
    if (current4.includes('still') || current4.includes('issue') || current4.includes('came back') || current4.includes('briefly')) {
      return msg(
        `Step 2: Is the issue worse indoors, or about the same everywhere?`,
        ['Worse indoors', 'Same everywhere', 'Not sure']
      );
    }
    // User says restart actually helped
    if ((current4.includes('yes') || current4.includes('helped')) && !current4.includes('still') && !current4.includes('not')) {
      return msg(
        `Great — sometimes all it takes is a fresh connection. Keep an eye on it over the next hour.\n\nIf it comes back, we can run through a few more steps. Anything else I can help with?`,
        ['It came back — keep going', "I'm good, thanks"]
      );
    }
    // User is responding to Step 2 (worse indoors / same everywhere)
    if (current4.includes('indoors') || current4.includes('worse')) {
      return msg(
        `Building materials can block 1–2 bars of signal — that may explain it.\n\nQuick test:\n• Move to a window or step outside briefly\n• Check if signal improves (top bar on your screen)\n• This tells us: coverage gap vs device issue\n\nStep 3 while you test: toggle Airplane Mode on for 10 seconds, then off — this forces your phone to re-register with the nearest tower.\n\nHow does it look?`,
        ['Signal improves outside', 'Same outside too', 'Airplane mode helped!', 'Still the same']
      );
    }
    if (current4.includes('same') || current4.includes('everywhere') || current4.includes('not sure')) {
      return msg(
        `Step 3 — Airplane Mode reset:\n• Toggle Airplane Mode on for 10 seconds\n• Then toggle it back off\n• This forces your phone to re-register with the nearest tower\n\nDid that help?`,
        ['Yes, that helped!', 'Done — still not working', 'Already tried that']
      );
    }
  }

  if (turn === 5) {
    const current5 = userMsgs[turn - 1]?.content?.toLowerCase() || '';
    // User just answered Step 2 (came via the "Did restart help?" extra loop)
    if (current5.includes('indoors') || current5.includes('worse')) {
      return msg(
        `Building materials can block 1–2 bars of signal — that may explain it.\n\nQuick test:\n• Move to a window or step outside briefly\n• Check if signal improves (top bar on your screen)\n• This tells us: coverage gap vs device issue\n\nStep 3 while you test: toggle Airplane Mode on for 10 seconds, then off — this forces your phone to re-register with the nearest tower.\n\nHow does it look?`,
        ['Signal improves outside', 'Same outside too', 'Airplane mode helped!', 'Still the same']
      );
    }
    if ((current5.includes('same') && !current5.includes('still')) || current5.includes('everywhere') || current5.includes('not sure')) {
      return msg(
        `Step 3 — Airplane Mode reset:\n• Toggle Airplane Mode on for 10 seconds\n• Then toggle it back off\n• This forces your phone to re-register with the nearest tower\n\nDid that help?`,
        ['Yes, that helped!', 'Done — still not working', 'Already tried that']
      );
    }
    // User responded to Step 3 (Airplane Mode) — it helped
    if ((current5.includes('helped') || current5.includes('yes') || current5.includes('improves')) && !current5.includes('still') && !current5.includes('not')) {
      return msg(
        `That's a good sign. The issue may clear up on its own as you move around. I'd suggest keeping an eye on it for the rest of the day.\n\nIf it comes back consistently, we can escalate to our network team who can run deeper diagnostics.\n\nAnything else I can help with?`,
        ['It keeps coming back', "I'm good, thanks"]
      );
    }
    // Step 4: SIM reseat (Step 3 not working, or came back)
    return msg(
      `Step 4 — SIM card reseat:\n• Power off your ${a.device || 'phone'}\n• Remove the SIM tray and reseat the card firmly\n• Power back on — this forces a fresh network registration\n• Have eSIM? Skip this and tap "Already tried" below\n\nCan you try that?`,
      ['Done — still the same', 'Fixed it!', 'How do I do that?', 'Already tried / eSIM']
    );
  }

  if (turn === 6) {
    const current6 = userMsgs[turn - 1]?.content?.toLowerCase() || '';
    // User just answered Step 2 (shifted path — came via two extra loops)
    if (current6.includes('indoors') || current6.includes('worse')) {
      return msg(
        `Building materials can block 1–2 bars of signal — that may explain it.\n\nQuick test:\n• Move to a window or step outside briefly\n• Check if signal improves (top bar on your screen)\n• This tells us: coverage gap vs device issue\n\nStep 3 while you test: toggle Airplane Mode on for 10 seconds, then off — this forces your phone to re-register with the nearest tower.\n\nHow does it look?`,
        ['Signal improves outside', 'Same outside too', 'Airplane mode helped!', 'Still the same']
      );
    }
    if ((current6.includes('same') && !current6.includes('still')) || current6.includes('everywhere') || current6.includes('not sure')) {
      return msg(
        `Step 3 — Airplane Mode reset:\n• Toggle Airplane Mode on for 10 seconds\n• Then toggle it back off\n• This forces your phone to re-register with the nearest tower\n\nDid that help?`,
        ['Yes, that helped!', 'Done — still not working', 'Already tried that']
      );
    }
    // Signal improves outside → confirmed indoor coverage gap → recommend Wi-Fi Calling
    if (current6.includes('improves') || current6.includes('signal improves')) {
      return msg(
        `That confirms it — the issue is indoor coverage, not your device. Building materials are blocking the signal.\n\nThe permanent fix is Wi-Fi Calling: your phone routes calls through your home Wi-Fi when cellular is weak indoors. It's included in Total 5G Unlimited ($55/mo).\n\nWant me to show you the plan, or would you prefer to talk to our network team?`,
        ['Show plan with Wi-Fi Calling', 'Talk to support', 'Schedule a callback']
      );
    }
    // User said Step 3 (Airplane Mode) or SIM reseat helped
    if ((current6.includes('fixed') || current6.includes('worked') || current6.includes('helped') || current6.includes('yes')) && !current6.includes('still') && !current6.includes('not')) {
      return msg(
        `Glad that did it! If you have any more issues, I'm right here.\n\nAnything else I can help with today?`,
        POST_FLOW_PILLS
      );
    }
    // User asking how to reseat SIM
    if (current6.includes('how do i') || current6.includes('how do') || (current6.includes('how') && !current6.includes('how much'))) {
      return msg(
        `On Samsung Galaxy devices:\n\n✅ Power off your phone completely\n✅ Use a SIM ejector or paperclip to open the tray\n✅ Remove the SIM — check for dirt or damage\n✅ Place it back firmly in the tray\n✅ Reinsert the tray and power back on\n\nThat forces a fresh network registration. Did that help?`,
        ['Yes, fixed it!', 'Still the same']
      );
    }
    // User answered Step 3 (Airplane Mode) still not working — show Step 4 SIM reseat
    if (current6.includes('still') || current6.includes('not working') || current6.includes('already tried') || (current6.includes('outside') && !current6.includes('improves'))) {
      return msg(
        `Step 4 — SIM card reseat:\n• Power off your ${a.device || 'phone'}\n• Remove the SIM tray and reseat the card firmly\n• Power back on — this forces a fresh network registration\n• Have eSIM? Skip this and tap "Already tried" below\n\nCan you try that?`,
        ['Done — still the same', 'Fixed it!', 'How do I do that?', 'Already tried / eSIM']
      );
    }
    // All steps done, still not working → escalation
    return msg(
      `We've gone through all four standard fixes and none of them resolved it. At this point it may be a deeper coverage issue in your area.\n\nI can connect you with our network team who can run deeper diagnostics — or I can show you a plan option that might help in the meantime.\n\nWhat would you prefer?`,
      ['Show plan with Wi-Fi Calling', 'Talk to support', 'Schedule a callback']
    );
  }

  if (turn === 7) {
    const current7 = userMsgs[turn - 1]?.content?.toLowerCase() || '';
    // User picked "Show plan with Wi-Fi Calling" from escalation
    if (current7.includes('wifi calling') || current7.includes('wi-fi calling') || current7.includes('show plan')) {
      return msg(
        `Total 5G Unlimited at $55/mo includes Wi-Fi Calling — your phone uses your home Wi-Fi for calls even when cellular is weak. That would solve most of your dropped call issues.\n\nThe change takes effect at your next billing cycle. Want me to schedule the upgrade?`,
        ['Yes, schedule the upgrade', 'How much more is that?', 'Let me think about it', 'No thanks — just connect me to support']
      );
    }
    // User picked "Talk to support", "Schedule a callback", or live chat option → trigger live chat flow
    if (current7.includes('talk') || current7.includes('support') || current7.includes('callback') || current7.includes('schedule') || current7.includes('live chat') || current7.includes('connect')) {
      return `I'll connect you with our network team right now — they can run deeper diagnostics on your account.\n\nLive chat wait time: ~4 minutes.\n[LIVE_CHAT_FLOW]`;
    }
    // Also handle Step 2/3 answers that arrive shifted to turn 7
    if (current7.includes('indoors') || current7.includes('worse')) {
      return msg(
        `Building materials can block 1–2 bars of signal — that may explain it.\n\nStep 3: toggle Airplane Mode on for 10 seconds, then off — this forces your phone to re-register with the nearest tower.\n\nHow does it look?`,
        ['Signal improves outside', 'Same outside too', 'Airplane mode helped!', 'Still the same']
      );
    }
    // Default → live chat
    return `I'll connect you with our network team right now — they can run deeper diagnostics on your account.\n\nLive chat wait time: ~4 minutes.\n[LIVE_CHAT_FLOW]`;
  }

  // Turn 8+: handle post-escalation responses (Wi-Fi Calling upgrade confirmation, live chat from deeper path)
  if (turn >= 8) {
    const current8 = userMsgs[turn - 1]?.content?.toLowerCase() || '';
    if (current8.includes('talk') || current8.includes('support') || current8.includes('callback') || current8.includes('schedule') || current8.includes('live chat') || current8.includes('connect me')) {
      return `I'll connect you with our network team right now — they can run deeper diagnostics on your account.\n\nLive chat wait time: ~4 minutes.\n[LIVE_CHAT_FLOW]`;
    }
    if (current8.includes('yes') || current8.includes('schedule the upgrade') || current8.includes('switch')) {
      return msg(
        `Done — your plan upgrade to Total 5G Unlimited ($55/mo) is scheduled for your next billing cycle. Wi-Fi Calling will activate automatically.\n\nIn the meantime, if you're in a weak signal area, connect to Wi-Fi and enable Wi-Fi Calling in your phone settings.\n\nAnything else I can help with?`,
        POST_FLOW_PILLS
      );
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

function getDerekTurnResponse(userMsgs, turn, persona) {
  const a      = persona?.account || {};
  const first  = userMsgs[0]?.content?.toLowerCase() || '';
  const prev   = userMsgs[turn - 2]?.content?.toLowerCase() || '';
  const latest = userMsgs[turn - 1]?.content?.toLowerCase() || '';

  const onDiagnose = first.includes('why') || first.includes('cap') || first.includes('keep hitting') || first.includes('keep running');
  const onUpgrade  = first.includes('upgrade') || first.includes('unlimited');
  const onAddData  = first.includes('add 5 gb') || first.includes('just add') || first.includes('$10');
  const onRenewal  = first.includes('renewal') || first.includes('no charge');

  // S3-002/S3-006: New diagnosis flow — Turn 1 was "Why do I keep hitting my cap?" landing pill.
  const isNewDiagFlow = onDiagnose &&
    userMsgs[1]?.content?.toLowerCase().includes("let's do it");

  // ── Diagnosis path ────────────────────────────────────────────────
  if (onDiagnose) {
    if (turn === 2) {
      // R11: Escape hatches for skip actions after diagnosisFlow.intro
      if (latest.includes('skip') && (latest.includes('upgrade') || latest.includes('options'))) {
        return msg(
          `I have a few options that could work for you. Let me walk you through the details in a moment.`,
          ['Show me options', 'Talk to someone', 'Return to home']
        );
      }
      if (latest.includes('skip') && (latest.includes('plan') || latest.includes('change'))) {
        return msg(
          `I have a few options that could work for you. Let me walk you through the details in a moment.`,
          ['Show me options', 'Talk to someone', 'Return to home']
        );
      }
      // Step 1: streaming question (same in old and new flow at Turn 2)
      return msg(
        `Let's check. Do you stream video often on cellular — YouTube, TikTok, Netflix — not just on Wi-Fi?`,
        ['Yes, a lot', 'Sometimes', 'Rarely']
      );
    }
    if (turn === 3) {
      if (isNewDiagFlow) {
        // New flow: latest = streaming answer (Turn 3 user message)
        if (latest.includes('yes') || latest.includes('lot') || latest.includes('sometimes')) {
          return msg(
            `That can use 1–3 GB per hour on HD.\n\nDo you also use your phone as a hotspot for a laptop or other devices?`,
            ['Yes, regularly', 'Occasionally', 'Never']
          );
        }
        if (latest.includes('rarely')) {
          return msg(
            `Interesting — it might be background data or app syncing then. Do you use your phone as a hotspot for other devices?`,
            ['Yes, regularly', 'Occasionally', 'Never']
          );
        }
      }
      // Old flow: prev = streaming answer
      if (prev.includes('yes') || prev.includes('lot') || prev.includes('sometimes')) {
        return msg(
          `That can use 1–3 GB per hour on HD.\n\nDo you also use your phone as a hotspot for a laptop or other devices?`,
          ['Yes, regularly', 'Occasionally', 'Never']
        );
      }
      if (prev.includes('rarely')) {
        return msg(
          `Interesting — it might be background data or app syncing then. Do you use your phone as a hotspot for other devices?`,
          ['Yes, regularly', 'Occasionally', 'Never']
        );
      }
    }
    if (turn === 4) {
      return msg(
        `Here are a few things you could try to reduce usage:\n\n✅ Set YouTube/Netflix/TikTok to Wi-Fi only in their settings\n✅ Check your top data-draining apps: Settings → Network → Data Usage\n✅ Disable background data for apps you don't need syncing constantly\n\nThat said — with 10 of 12 months at the cap, you've likely spent around $150 extra this year on data boosts that Unlimited would have prevented.\n\nWant to see your upgrade options? You can start now or schedule it for ${a.renewalDate} — no charge today.`,
        ['Show upgrade options', "I'll try the tips first", 'Not right now']
      );
    }
    if (turn === 5) {
      if (prev.includes('upgrade') || prev.includes('options') || prev.includes('show')) {
        return msg(
          `I have a few options that could work for you. Let me walk you through the details in a moment.`,
          ['Show me options', 'Talk to someone', 'Return to home']
        );
      }
      return msg(
        `No problem. If you change your mind after trying those tips, I'll be here. Upgrading is always an option at any point.\n\nAnything else I can help with?`,
        ['Try the tips — come back later', 'Actually, show me upgrade options']
      );
    }
  }

  // ── Upgrade direct path ──────────────────────────────────────────
  if (onUpgrade) {
    if (turn === 2) {
      if (prev.includes('upgrade') || prev.includes('unlimited') || prev.includes('now')) {
        return msg(
          `The Unlimited plan includes unlimited data and Disney+ ($7.99/mo value). Check the current price at totalwireless.com.\n\nYou can upgrade now (prorated for the ${a.daysUntilRenewal} days remaining) or wait until ${a.renewalDate}.\n\nWhich works better?`,
          ['Upgrade now — prorated charge', `Upgrade at renewal ${a.renewalDate}`, 'Just add data for now — $10', "Tell me what's included"]
        );
      }
      if (prev.includes('renewal') || prev.includes('no charge') || prev.includes('start at')) {
        return msg(
          `Scheduled. Starting ${a.renewalDate} you'll be on Total 5G Unlimited. Nothing to pay today.\n\nWant me to add 5 GB now to cover the rest of this cycle?`,
          ['Yes — add 5 GB for $10', "I'll manage", 'Actually, upgrade now']
        );
      }
    }
    if (turn === 3) {
      if (prev.includes('now') || prev.includes('prorated') || prev.includes('upgrade now')) {
        return msg(
          `I have a few options that could work for you. Let me walk you through the details in a moment.`,
          ['Show me options', 'Talk to someone', 'Return to home']
        );
      }
      if (prev.includes('included') || prev.includes("what's included") || prev.includes('tell me')) {
        return msg(
          `Total 5G Unlimited includes:\n\n• Unlimited high-speed 5G data — no caps, ever\n• 15 GB mobile hotspot\n• Disney+ Basic ($7.99/mo value)\n• Wi-Fi Calling\n• 5-year price guarantee\n\nAt 4 data boosts/year you'd save roughly $135/yr. Want to go ahead?`,
          ['Upgrade now', `Upgrade at renewal ${a.renewalDate}`, 'Not right now']
        );
      }
      if (prev.includes('add 5 gb') || prev.includes('$10') || prev.includes('just add')) {
        return `Adding 5 GB to cover you until ${a.renewalDate}:\n[REFILL_FLOW]`;
      }
      if (prev.includes('upgrade now') || prev.includes('go ahead')) {
        return msg(
          `I have a few options that could work for you. Let me walk you through the details in a moment.`,
          ['Show me options', 'Talk to someone', 'Return to home']
        );
      }
    }
    if (turn >= 4) {
      if (prev.includes('upgrade') || prev.includes('confirm') || prev.includes('yes')) {
        return msg(
          `I have a few options that could work for you. Let me walk you through the details in a moment.`,
          ['Show me options', 'Talk to someone', 'Return to home']
        );
      }
    }
  }

  // ── Add data path ────────────────────────────────────────────────
  if (onAddData) {
    if (turn === 2) {
      return msg(
        `Adding 5 GB to your account now.\n\n┌─────────────────────────────────────┐\n│  5 GB Data Add-On — $10             │\n│  Activates instantly                 │\n│  Charged to: ${a.savedCard || 'card on file'}      │\n└─────────────────────────────────────┘\n\nConfirm?`,
        ['Confirm — $10', 'Cancel']
      );
    }
    if (turn === 3) {
      if (prev.includes('confirm') || prev.includes('yes')) {
        return `Processing.\n[REFILL_FLOW]`;
      }
    }
  }

  // ── Schedule at renewal path ─────────────────────────────────────
  if (onRenewal && turn === 2) {
    return msg(
      `Done — your upgrade to Total 5G Unlimited is scheduled for ${a.renewalDate}. Nothing to pay today.\n\nWant me to add 5 GB now to cover the next ${a.daysUntilRenewal} days?`,
      [`Yes — add 5 GB for $10`, "I'll manage"]
    );
  }

  // Late turn catch-all
  if (turn >= 5) {
    if (prev.includes('upgrade') || prev.includes('unlimited') || prev.includes('show')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (prev.includes('add') || prev.includes('$10') || prev.includes('data')) {
      return `[REFILL_FLOW]`;
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

function getAnaTurnResponse(userMsgs, turn, persona) {
  const a    = persona?.account || {};
  const _first = userMsgs[0]?.content?.toLowerCase() || '';
  const prev  = userMsgs[turn - 2]?.content?.toLowerCase() || '';

  if (turn === 2) {
    if (prev.includes('redeem') || prev.includes('free') || prev.includes('pts')) {
      return msg(
        `Redeeming 1,000 pts for the Global Calling Card.\n\n┌────────────────────────────────────────────────────────┐\n│  Global Calling Card — FREE (1,000 pts)                │\n│  Value: $10/mo · 200+ countries                        │\n│  Colombia: ~$0.02/min  (was ~$0.25/min)                │\n│  200 pts remaining after redemption                    │\n└────────────────────────────────────────────────────────┘\n\nConfirm?`,
        ['Yes — get it free', 'Pay $10 instead', 'Cancel']
      );
    }
    if (prev.includes('pay $10') || prev.includes('pay instead')) {
      return msg(
        `Sure — charging ${a.savedCard || 'Visa ••••9902'} $10/mo.\n\n┌──────────────────────────────────────────────────────┐\n│  Global Calling Card — $10/mo                        │\n│  200+ countries · Auto-renews · Cancel anytime       │\n│  Charged to: ${a.savedCard || 'Visa ••••9902'}                 │\n└──────────────────────────────────────────────────────┘\n\nConfirm?`,
        ['Confirm — $10/mo', 'Use points instead', 'Cancel']
      );
    }
    if (prev.includes('tell me more') || prev.includes('more')) {
      return msg(
        `The Global Calling Card is a $10/mo add-on that gives you discounted rates to 200+ countries:\n\n• Colombia: ~$0.02/min  (you're paying ~$0.25/min now)\n• Mexico: ~$0.02/min\n• Savings: ~$18/mo at your call volume\n\nYour 1,200 points cover the first month free. Auto-renews at $10/mo after that. Cancel anytime.\n\nWant to use your points or pay $10?`,
        ['Get it free with points', 'Pay $10/mo', 'Not right now']
      );
    }
    if (prev.includes('all add-on') || prev.includes('see all')) {
      return msg(
        `Here are all available add-ons for your account:\n\n• $0  Global Calling Card (1,000 pts — you qualify ✓)\n• $10 Global Calling Card (cash)\n• $10 · 5 GB Data Add-On\n• $20 · 15 GB Data Add-On\n• Disney+ (available with Unlimited plans)\n\nWhich one are you interested in?`,
        ['Global Calling Card — free', '5 GB Data Add-On — $10', '15 GB Data Add-On — $20', 'Tell me about Unlimited']
      );
    }
  }

  if (turn === 3) {
    if (prev.includes('yes') || prev.includes('free') || prev.includes('confirm') || prev.includes('get it free')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (prev.includes('$10') || prev.includes('pay') || prev.includes('cash')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (prev.includes('not right now') || prev.includes('cancel')) {
      return msg(
        `No problem. Your points will stay in your account. Just come back when you're ready — I'll have the same offer waiting.\n\nAnything else I can help with?`,
        ['Check my account', "That's it for now"]
      );
    }
    if (prev.includes('global') || prev.includes('calling card')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (prev.includes('5 gb') || prev.includes('data')) {
      return `Adding 5 GB to your account.\n[REFILL_FLOW]`;
    }
    if (prev.includes('unlimited')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
  }

  if (turn >= 4) {
    if (prev.includes('confirm') || prev.includes('yes') || prev.includes('go ahead')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

function getRobertTurnResponse(userMsgs, turn, persona) {
  const a    = persona?.account || {};
  const _first = userMsgs[0]?.content?.toLowerCase() || '';
  const prev  = userMsgs[turn - 2]?.content?.toLowerCase() || '';

  if (turn === 2) {
    if (prev.includes('comparison') || prev.includes('compare') || prev.includes('see full') || prev.includes('side-by-side')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (prev.includes('upgrade') || prev.includes('unlimited') || prev.includes('save $50')) {
      return msg(
        `Switching all ${a.familyLines} lines to Total 5G Unlimited.\n\n┌──────────────────────────────────────────────────┐\n│  ${a.familyLines} lines × Total 5G Unlimited                   │\n│  $110/mo total  (was $${a.currentMonthlySpend}/mo)                    │\n│  Prorated charge today: ~$27 (${a.daysUntilRenewal} days left)  │\n│  Or: Start at renewal ${a.renewalDate} — $0 today         │\n└──────────────────────────────────────────────────┘\n\nStart now or wait until ${a.renewalDate}?`,
        [`Start now — ~$27 today`, `Switch on ${a.renewalDate} — $0 today`, 'Cancel']
      );
    }
    if (prev.includes('calculate') || prev.includes('pricing') || prev.includes('4-line')) {
      return msg(
        `Here's the pricing for ${a.familyLines} lines:\n\n• Total Base 5G:   $${a.currentMonthlySpend}/mo ($${a.currentMonthlySpend / a.familyLines}/line) — current\n• 5G Unlimited:    $110/mo ($27.50/line) — saves $50/mo\n• 5G+:             $130/mo ($32.50/line) — saves $30/mo\n\nAll plans include Wi-Fi Calling, 5G, and a 5-year price guarantee. Unlimited adds Disney+ per line.\n\nWant to switch?`,
        ['Switch to 5G Unlimited — $110/mo', 'Switch on renewal — $0 today', 'Show full comparison', 'Not ready']
      );
    }
    if (prev.includes('not ready') || prev.includes("thinking")) {
      return msg(
        `No problem — take your time. The 5-year price guarantee means the rate won't change even after you decide.\n\nAnything else I can clarify?`,
        ['Show side-by-side comparison', 'Calculate pricing again', "I'm good, thanks"]
      );
    }
  }

  if (turn === 3) {
    if (prev.includes('now') || prev.includes('$27') || prev.includes('start now')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (prev.includes('renewal') || prev.includes(`${a.renewalDate}`) || prev.includes('$0 today') || prev.includes('switch on')) {
      return msg(
        `Done — all ${a.familyLines} lines will switch to Total 5G Unlimited on ${a.renewalDate}. Nothing to pay today.\n\nYou'll save $50/mo starting that date — that's $600/year.\n\nAnything else I can help with?`,
        ['Confirm that schedule', "I'm done for now"]
      );
    }
    if (prev.includes('upgrade') || prev.includes('switch') || prev.includes('unlimited')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
  }

  if (turn >= 4) {
    if (prev.includes('upgrade') || prev.includes('confirm') || prev.includes('go ahead') || prev.includes('yes')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
  }

  return null;
}

// ─── Generic multi-turn flows (fallback) ─────────────────────────────────────
const FLOWS = {
  'slow-data': [
    { text: "Got it — slow data is really frustrating. Let me help figure out what's going on. When does it feel the slowest?", pills: ["All the time", "Mostly evenings", "When I'm out and about", "It just started recently"] },
    { text: "That's helpful. Are you noticing it with specific apps, or is everything slow — like loading websites, maps, all of it?", pills: ["Specific apps like video or social media", "Everything is slow", "Mostly browsing and email", "Maps and navigation"] },
    { text: "One more thing — do you know how much data your current plan gives you? Sometimes slowdowns happen after you've used your high-speed data for the month.", pills: ["1-5 GB", "10-15 GB", "Unlimited", "I'm not sure"] },
    { text: "Last question — are you usually on Wi-Fi at home, or do you rely mostly on cellular data throughout the day?", pills: ["Mostly Wi-Fi at home", "Mostly cellular data", "About 50/50", "I don't have Wi-Fi at home"] },
  ],
  'runs-out': [
    { text: "Running out of data before the month is over is the worst. How early in your billing cycle does it usually happen?", pills: ["Within the first two weeks", "Around week three", "Just the last few days", "It's unpredictable"] },
    { text: "And how much data does your current plan include? That'll help me understand if you need a bigger bump or just a small upgrade.", pills: ["1 GB", "5 GB", "10-15 GB", "I'm not sure"] },
    { text: "What do you think is eating up most of your data?", pills: ["Streaming video (YouTube, Netflix)", "Social media (TikTok, Instagram)", "Video calls (FaceTime, Zoom)", "I honestly don't know"] },
    { text: "Do you also use your phone as a hotspot — like connecting your laptop or tablet to your phone's data?", pills: ["Yes, regularly", "Occasionally", "No, never", "I didn't know I could do that"] },
  ],
  'slow-phone': [
    { text: "A slow phone is really annoying. Let me ask a few questions to figure out what might help. How old is your current phone?", pills: ["Less than a year", "1-2 years", "3-4 years", "5+ years or not sure"] },
    { text: "What kind of phone are you using right now?", pills: ["iPhone (older model)", "iPhone (recent model)", "Samsung Galaxy", "Another Android phone"] },
    { text: "When it feels slow, what's usually happening?", pills: ["Apps take forever to open", "Switching between apps is laggy", "The whole phone freezes up", "Camera is slow or glitchy"] },
    { text: "One more thing — is your phone storage almost full? That can actually cause a lot of slowness.", pills: ["Yes, it says storage is almost full", "I have some space left", "Plenty of space", "I don't know how to check"] },
  ],
  'storage': [
    { text: "Running out of storage is a pain. What's taking up the most space on your phone?", pills: ["Photos and videos", "Apps and games", "Messages and downloads", "I'm not sure"] },
    { text: "How much storage does your current phone have?", pills: ["32 GB or less", "64 GB", "128 GB", "I don't know"] },
    { text: "Have you tried clearing old files or offloading apps, or are you at the point where you need a phone with more built-in storage?", pills: ["I've tried clearing stuff, still full", "I clear it but it fills back up", "I haven't tried yet", "I'd rather just get more storage"] },
    { text: "Would you prefer a phone with expandable storage (microSD card slot) so you can add more later, or is built-in storage fine?", pills: ["Expandable storage sounds great", "Built-in is fine if it's enough", "I don't have a preference", "What's the difference?"] },
  ],
  'camera': [
    { text: "Better photos — I can help with that! What kind of photos do you take most often?", pills: ["Family and friends", "Nature and landscapes", "Food and products", "A bit of everything"] },
    { text: "What bothers you most about your current phone's camera?", pills: ["Blurry photos", "Bad in low light", "Colors look washed out", "No zoom or portrait mode"] },
    { text: "Do you also shoot a lot of video, or is it mainly photos?", pills: ["Mostly photos", "Lots of video too", "About equal", "I mainly just do selfies"] },
    { text: "And what's your budget range for a new phone?", pills: ["Under $150", "$150 - $250", "$250 - $400", "I'm flexible on budget"] },
  ],
  'cost': [
    { text: "Saving money is smart — let me find you the best value. Do you know roughly how much you're paying per month right now?", pills: ["Around $30-40", "Around $50-60", "Over $60", "I'm not sure"] },
    { text: "What do you mainly use your phone for on a daily basis?", pills: ["Calls and texts mostly", "Social media and browsing", "Streaming music or video", "A bit of everything"] },
    { text: "How much data do you realistically need each month?", pills: ["I barely use any data", "A few GB is probably fine", "I need at least 10-15 GB", "I'm a heavy data user"] },
    { text: "Are you also looking at getting a new phone, or just want a cheaper plan for the phone you already have?", pills: ["Just a cheaper plan", "Cheaper plan + new phone", "Mainly need a new affordable phone", "I want to save on everything"] },
  ],
  'new-phone': [
    { text: "Exciting! Let me help you find the right one. What's the main reason you're looking for a new phone?", pills: ["Current phone is too slow", "Screen is cracked or damaged", "I want better features", "It's just time for an upgrade"] },
    { text: "What matters most to you in a new phone?", pills: ["Great camera", "Long battery life", "Lots of storage", "Best overall performance"] },
    { text: "Do you have a brand preference, or are you open to anything?", pills: ["I prefer iPhone", "I prefer Samsung", "I'm open to any brand", "Whatever gives the best value"] },
    { text: "And what's your budget looking like?", pills: ["Under $100", "$100 - $200", "$200 - $300", "I'm flexible"] },
  ],
  'not-working': [
    { text: "Sorry to hear something's not right. Can you tell me more about what's going on?", pills: ["Calls dropping or no signal", "Texts not sending", "Can't connect to internet", "Phone keeps crashing or restarting"] },
    { text: "How long has this been happening?", pills: ["Just started today", "A few days now", "It's been weeks", "It comes and goes"] },
    { text: "Have you tried restarting your phone or toggling airplane mode on and off? Sometimes that clears things up.", pills: ["Yes, didn't help", "Yes, it helped temporarily", "No, I haven't tried that", "I've tried everything"] },
    { text: "Based on what you're describing, this might be something our support team can troubleshoot more deeply. What phone are you using?", pills: ["An older iPhone", "A recent iPhone", "A Samsung Galaxy", "Another Android phone"] },
  ],
};

const RECOMMENDATIONS = {
  'slow-data': [
    { type: "plan", id: "5g-unlimited", reason: "Unlimited data ends throttling permanently — no caps, no slowdowns. Includes 15 GB hotspot.", isBest: true, solveHighlight: "Unlimited = no more throttling" },
    { type: "plan", id: "5g-plus-unlimited", reason: "For the absolute fastest speeds — premium 5G, 25 GB hotspot, and Disney+ Premium.", isBest: false, solveHighlight: "Premium 5G speeds + 25 GB hotspot" },
    { type: "plan", id: "base-5g", reason: "If you just need more data this month, start here — 5 GB at $20/mo, most affordable option.", isBest: false, solveHighlight: "Most affordable option" },
  ],
  'runs-out': [
    { type: "plan", id: "5g-unlimited", reason: "Unlimited data means you'll never run out again. Zero cap, zero surprises, plus 15 GB hotspot.", isBest: true, solveHighlight: "Unlimited = never run out again" },
    { type: "plan", id: "5g-plus-unlimited", reason: "For heavy users who also hotspot a lot — 25 GB hotspot and premium 5G speeds.", isBest: false, solveHighlight: "25 GB hotspot + premium 5G" },
    { type: "plan", id: "base-5g", reason: "Most affordable at $20/mo — 5 GB of 5G data. Best if this is a one-time issue.", isBest: false, solveHighlight: "Most affordable — $20/mo" },
  ],
  'slow-phone': [
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 at $199 has 6GB RAM — a major upgrade that'll make everything feel snappy and responsive again.", isBest: true, costDiff: "$199", solveHighlight: "6GB RAM = no more lag or freezing" },
    { type: "phone", id: "moto-g-power", reason: "The Moto G Power at just $99 gives you solid performance with 128GB storage and a huge battery.", isBest: false, costDiff: "$99", solveHighlight: "128GB + all-day battery for $99" },
    { type: "phone", id: "iphone-se", reason: "If you prefer Apple, the iPhone SE at $249 has the A15 Bionic chip — incredibly fast for the price.", isBest: false, costDiff: "$249", solveHighlight: "A15 chip = flagship-level speed" },
  ],
  'storage': [
    { type: "phone", id: "moto-g-stylus", reason: "The Moto G Stylus has 256GB of built-in storage — room for thousands of photos and dozens of apps.", isBest: true, costDiff: "$179", solveHighlight: "256GB = room for thousands of photos" },
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 at $199 has 128GB built in, plus a microSD card slot so you can expand to 1TB.", isBest: false, costDiff: "$199", solveHighlight: "128GB + expandable to 1TB" },
    { type: "phone", id: "samsung-a15", reason: "The Galaxy A15 at $139 gives you 128GB of storage with a great AMOLED display.", isBest: false, costDiff: "$139", solveHighlight: "128GB + gorgeous AMOLED screen" },
  ],
  'camera': [
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 at $199 has a 50MP camera with optical image stabilization — your photos will be sharper, even in low light.", isBest: true, costDiff: "$199", solveHighlight: "50MP + OIS = sharp photos in any light" },
    { type: "phone", id: "samsung-a15", reason: "The Galaxy A15 at $139 has the same 50MP sensor and a gorgeous AMOLED display.", isBest: false, costDiff: "$139", solveHighlight: "50MP sensor + vibrant AMOLED display" },
    { type: "phone", id: "iphone-se", reason: "If you love Apple's photo processing, the iPhone SE at $249 takes incredible photos with Portrait mode and Smart HDR.", isBest: false, costDiff: "$249", solveHighlight: "Portrait mode + Smart HDR" },
  ],
  'cost': [
    { type: "plan", id: "base-5g", reason: "At just $20/mo, Total Base 5G is the most affordable option — 5 GB of 5G data, unlimited talk & text.", isBest: true, solveHighlight: "Lowest bill — just $20/mo" },
    { type: "plan", id: "5g-unlimited", reason: "Unlimited data with no caps at see-current-price. Includes 15 GB hotspot and Disney+ Basic.", isBest: false, solveHighlight: "Unlimited = best value for heavy users" },
    { type: "plan", id: "5g-plus-unlimited", reason: "Our top tier — premium 5G speeds, 25 GB hotspot, Disney+ Premium.", isBest: false, solveHighlight: "Premium 5G + 25 GB hotspot" },
  ],
  'new-phone': [
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 at $199 is the best all-rounder — 50MP camera with OIS, 6GB RAM, gorgeous Super AMOLED display, and 5000mAh battery.", isBest: true, costDiff: "$199", solveHighlight: "Best all-rounder — camera, speed & battery" },
    { type: "phone", id: "moto-g-power", reason: "If budget is a priority, the Moto G Power at $99 delivers solid performance, a massive battery, and 128GB storage.", isBest: false, costDiff: "$99", solveHighlight: "Best value — solid performance for $99" },
    { type: "phone", id: "iphone-se", reason: "For Apple fans, the iPhone SE at $249 packs the powerful A15 Bionic chip, 5G capability, and the full iOS ecosystem.", isBest: false, costDiff: "$249", solveHighlight: "Full Apple ecosystem + A15 chip" },
  ],
  'not-working': [
    { type: "human", reason: "Based on what you've described, I think our support specialists can help troubleshoot this faster. They can check your account, run network diagnostics, and resolve most issues on the spot.", isBest: true },
    { type: "plan", id: "5g-unlimited", reason: "If connectivity issues are plan-related, Unlimited gives you priority data and no throttling.", isBest: false, solveHighlight: "Unlimited priority data = fewer connectivity issues" },
    { type: "phone", id: "moto-g-stylus-2025", reason: "If your phone itself is the problem, the Moto G Stylus 2025 is a dependable replacement.", isBest: false, solveHighlight: "Reliable 5G replacement" },
  ],
};

const REC_MESSAGES = {
  'slow-data': "Alright, I've got a clear picture now. Based on your usage, here's what I'd recommend to fix your speed issues:",
  'runs-out': "OK, I can see why you're running out. Here are the best options to make sure you always have enough data:",
  'slow-phone': "Based on what you've told me, it sounds like a phone upgrade would make the biggest difference. Here are my top picks for you:",
  'storage': "Got it — you need more storage space. Here are the best phones that'll solve that problem:",
  'camera': "Great taste! Here are the best camera phones I'd recommend based on what you're looking for:",
  'cost': "I love finding ways to save. Here are the most affordable options that still cover what you need:",
  'new-phone': "Awesome — based on your preferences, here are the phones I'd recommend checking out:",
  'not-working': "I hear you — let's get this sorted. Here's what I think will help the most:",
};

function getFlowKey(firstMessage) {
  const m = firstMessage.toLowerCase();
  if (m.includes('refill') || m.includes('renew') || m.includes('expir') || m.includes('autopay')) return 'refill';
  if (m.includes('upgrade') || m.includes('unlimited') || m.includes('55/mo') || (m.includes('upgrade') && m.includes('plan'))) return 'upgrade';
  if (m.includes('international') || m.includes('calling card') || m.includes('colombia') || m.includes('global call')) return 'international';
  if (m.includes('activate') && (m.includes('sim') || m.includes('esim'))) return 'activate';
  if (m.includes('connectivity') || m.includes('support') || m.includes('outage') || m.includes('dropped') || m.includes('signal')) return 'support';
  if (m.includes('compare') || (m.includes('side') && m.includes('side')) || m.includes('family pric')) return 'compare';
  if (m.includes('slow') && (m.includes('data') || m.includes('internet') || m.includes('speed'))) return 'slow-data';
  if (m.includes('run out') || m.includes('runs out') || (m.includes('data') && m.includes('end of'))) return 'runs-out';
  if (m.includes('sluggish') || (m.includes('slow') && m.includes('phone'))) return 'slow-phone';
  if (m.includes('storage') || m.includes('space') || m.includes('full')) return 'storage';
  if (m.includes('photo') || m.includes('picture') || m.includes('camera')) return 'camera';
  if (m.includes('cheap') || m.includes('cost') || m.includes('spend less') || m.includes('save') || m.includes('affordable')) return 'cost';
  if (m.includes('new phone') || m.includes('replace') || m.includes('thinking about getting')) return 'new-phone';
  if (m.includes('not working') || m.includes("isn't working") || m.includes('broken') || m.includes("can't connect")) return 'not-working';
  return null; // No scripted flow matched — API fallback will handle this
}

// ─── US-009: Alex — BYOP multi-turn flow ──────────────────────────────────────
function getAlexPhoneTurnResponse(userMessages, persona) {
  const msgs = userMessages.map(m => m.content?.toLowerCase() || '');
  const last = msgs[msgs.length - 1] || '';
  const turnCount = userMessages.length;

  // Helper: show iPhone options
  function showIphoneOptions() {
    return `With your 2,450 rewards points, the iPhone 13 comes to $24.99. Here are your best iPhone options:\n[RECOMMENDATIONS]${JSON.stringify([
      { type: 'phone', id: 'iphone-13',  reason: '$24.99 after your 2,450 rewards points — significant upgrade from iPhone 12.', isBest: true,  costDiff: '−$25 with rewards' },
      { type: 'phone', id: 'iphone-17e', reason: 'Newest iPhone — A18 chip, 48MP camera, $300 in bill credits available.', isBest: false },
    ])}[/RECOMMENDATIONS][ACTION_PILLS]${JSON.stringify(['I want the iPhone 13 — $24.99', 'Tell me more about iPhone 17e', 'Show me Samsung too'])}[/ACTION_PILLS]`;
  }

  // Helper: show Samsung options
  function showSamsungOptions() {
    return `Here are your best free options on your Unlimited plan — no trade-in needed:\n[RECOMMENDATIONS]${JSON.stringify([
      { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: 'Best free option — Super AMOLED display, 50MP camera, 5G. Biggest upgrade from iPhone 12.', isBest: true },
      { type: 'phone', id: 'samsung-galaxy-a17-5g', reason: 'Also free — reliable 5G, 50MP camera, great everyday Samsung.', isBest: false },
    ])}[/RECOMMENDATIONS][ACTION_PILLS]${JSON.stringify(['I want the Galaxy A36', 'I want the Galaxy A17', 'Show me iPhones too'])}[/ACTION_PILLS]`;
  }

  // Cross-navigation: "Show me Samsung too" / "Show me iPhones too" at any turn
  if (last.includes('show me samsung') || last.includes('samsung too')) {
    return showSamsungOptions();
  }
  if (last.includes('show me iphone') || last.includes('iphones too')) {
    return showIphoneOptions();
  }
  if (last.includes('show me all') || last.includes('all phones') || last.includes('show all')) {
    return `Here are your top picks based on your Unlimited plan. A few are completely free:\n[RECOMMENDATIONS]${JSON.stringify([
      { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: 'Best free phone — Super AMOLED, 50MP camera, 5G. No cost, no trade-in.', isBest: true },
      { type: 'phone', id: 'iphone-13',             reason: '$24.99 after your 2,450 rewards points — solid iPhone upgrade.', isBest: false, costDiff: '−$25 with rewards' },
      { type: 'phone', id: 'moto-g-stylus-2025',    reason: 'Free with your plan — built-in stylus, 256GB storage, big battery.', isBest: false },
    ])}[/RECOMMENDATIONS][ACTION_PILLS]${JSON.stringify(['I want the Galaxy A36 (free)', 'I want the iPhone 13', 'I want the Moto G Stylus'])}[/ACTION_PILLS]`;
  }

  // iPhone 17e detail request — don't route to order summary
  if (last.includes('17e') || last.includes('iphone 17')) {
    return msg(
      `The iPhone 17e is the newest iPhone in the lineup:\n\n• A18 chip — same as iPhone 16 Pro\n• 48MP main camera\n• 6.1-inch OLED display\n• Up to $300 in bill credits available (applied over 24 months)\n\nAfter bill credits: effectively $0–$12.50/mo depending on plan.\n\nWant to go with the 17e, or stick with the iPhone 13 at $24.99 upfront?`,
      ['I want the iPhone 17e', 'I want the iPhone 13 — $24.99', 'Show me Samsung too']
    );
  }

  // "Go back" — re-show the mixed options
  if (last.includes('go back') || last === 'back') {
    return `Here are your top picks based on your Unlimited plan. A few are completely free:\n[RECOMMENDATIONS]${JSON.stringify([
      { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: 'Best free phone — Super AMOLED, 50MP camera, 5G. No cost, no trade-in.', isBest: true },
      { type: 'phone', id: 'iphone-13',             reason: '$24.99 after your 2,450 rewards points — solid iPhone upgrade.', isBest: false, costDiff: '−$25 with rewards' },
      { type: 'phone', id: 'moto-g-stylus-2025',    reason: 'Free with your plan — built-in stylus, 256GB storage, big battery.', isBest: false },
    ])}[/RECOMMENDATIONS][ACTION_PILLS]${JSON.stringify(['I want the Galaxy A36 (free)', 'I want the iPhone 13', 'I want the Moto G Stylus'])}[/ACTION_PILLS]`;
  }

  // Turn 1-2: Show phone options as visual cards
  if (turnCount <= 2) {
    if (last.includes('iphone') || last.includes('apple')) {
      return showIphoneOptions();
    }
    if (last.includes('samsung') || last.includes('android')) {
      return showSamsungOptions();
    }
    // Default: show a curated mix
    return `Here are your top picks based on your Unlimited plan. A few are completely free:\n[RECOMMENDATIONS]${JSON.stringify([
      { type: 'phone', id: 'samsung-galaxy-a36-5g', reason: 'Best free phone — Super AMOLED, 50MP camera, 5G. No cost, no trade-in.', isBest: true },
      { type: 'phone', id: 'iphone-13',             reason: '$24.99 after your 2,450 rewards points — solid iPhone upgrade.', isBest: false, costDiff: '−$25 with rewards' },
      { type: 'phone', id: 'moto-g-stylus-2025',    reason: 'Free with your plan — built-in stylus, 256GB storage, big battery.', isBest: false },
    ])}[/RECOMMENDATIONS][ACTION_PILLS]${JSON.stringify(['I want the Galaxy A36 (free)', 'I want the iPhone 13', 'I want the Moto G Stylus', 'Show me all phones'])}[/ACTION_PILLS]`;
  }

  // Confirm order — must run BEFORE isPhonePick so "Yes, order it — $24.99"
  // doesn't get re-matched as a phone selection via the '24.99' substring check.
  if (last.includes('order it') || last.includes('confirm') || last.includes('place') ||
      (last.includes('yes') && (last.includes('order') || last.includes('free') || last.includes('24.99')))) {
    const priorMsg = msgs[msgs.length - 2] || '';
    const isIphone = priorMsg.includes('iphone') || priorMsg.includes('13') || priorMsg.includes('24.99');
    const isMotoOrder = priorMsg.includes('moto') || priorMsg.includes('stylus');
    const isA17Order  = priorMsg.includes('a17');
    const item  = isIphone ? 'iPhone 13' : isMotoOrder ? 'Moto G Stylus' : isA17Order ? 'Samsung Galaxy A17' : 'Samsung Galaxy A36';
    const price = isIphone ? '$24.99' : 'FREE';
    const free  = !isIphone;
    return `[PHONE_ORDER_FLOW]${JSON.stringify({ item, price, free, card: 'Visa ••••7823', rewards: isIphone ? '−$25.00 (2,450 pts)' : null })}[/PHONE_ORDER_FLOW]`;
  }

  // Turn 3+: User picks a specific phone — confirm specs and price
  // Note: '24.99' is excluded from isIphoneSelection to avoid matching "Yes, order it — $24.99"
  const isIphoneSelection = (last.includes('iphone 13') || last.includes('24.99')) && !last.includes('17e') && !last.includes('order it');
  const isIphone17e = last.includes('17e') || last.includes('iphone 17e');
  const isMoto = last.includes('moto') || last.includes('stylus');
  const isA17 = last.includes('a17');
  const isA36 = last.includes('a36') || last.includes('galaxy a36');
  const isPhonePick = isIphoneSelection || isIphone17e || isMoto || isA17 || isA36 ||
    last.includes('want the') || last.includes('i want') || last.includes('pick') ||
    (last.includes('free') && !last.includes('completely') && !last.includes('order it'));

  if (isPhonePick) {
    if (isIphoneSelection) {
      return msg(
        `Here's your order summary:\n\n**iPhone 13**\n• Color: Midnight\n• Storage: 128 GB\n• Regular price: $49.99\n• Rewards discount: −$25.00 (2,450 pts)\n• You pay: $24.99\n• Points remaining after purchase: 0\n• Ships: 2–3 business days\n• Card: Visa ••••7823\n\nReady to place the order?`,
        ['Yes, order it — $24.99', 'Go back']
      );
    }
    if (isMoto) {
      return msg(
        `Here's your order summary:\n\n**Moto G Stylus**\n• Color: Graphite\n• Storage: 128 GB\n• Price: FREE with your Unlimited plan\n• Ships: 2–3 business days\n• Card: Visa ••••7823\n\nReady to place the order?`,
        ['Yes, order it — FREE', 'Go back']
      );
    }
    if (isA17) {
      return msg(
        `Here's your order summary:\n\n**Samsung Galaxy A17**\n• Color: Black\n• Storage: 64 GB\n• Price: FREE with your Unlimited plan\n• Ships: 2–3 business days\n• Card: Visa ••••7823\n\nReady to place the order?`,
        ['Yes, order it — FREE', 'Go back']
      );
    }
    // Default / Galaxy A36
    return msg(
      `Here's your order summary:\n\n**Samsung Galaxy A36**\n• Color: Awesome Navy\n• Storage: 128 GB\n• Price: FREE with your Unlimited plan\n• Ships: 2–3 business days\n• Card: Visa ••••7823\n\nReady to place the order?`,
      ['Yes, order it — FREE', 'Go back']
    );
  }

  // Fallback
  return msg(
    `Happy to help you find the right fit. What matters most to you — camera, battery, screen size, or keeping the cost down?`,
    ['Best camera', 'Longest battery', 'Biggest screen', 'Cheapest option']
  );
}

// ─── US-010: Nina — Activation multi-turn flow ────────────────────────────────
function getNinaTurnResponse(userMsgs, turn) {
  const latest = userMsgs[turn - 1]?.content?.toLowerCase() || '';

  if (turn === 2) {
    if (
      latest.includes('port') || latest.includes('current number') ||
      latest.includes('existing') || latest.includes('keep')
    ) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (
      latest.includes('new number') || latest.includes('fresh') ||
      latest.includes('new') || latest.includes('get a new')
    ) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (latest.includes('plan') || latest.includes('help') || latest.includes('choose')) {
      return `Sure! The most popular option for a new phone is Total Base 5G Unlimited at $20/mo — unlimited data, talk, and text. No annual contract.\n\nOnce you pick a plan we'll start activation.\n[ACTION_PILLS]${JSON.stringify(['Total Base 5G — $20/mo', 'See all plans', 'Port my number', 'Get a new number'])}[/ACTION_PILLS]`;
    }
    if (latest.includes('what') || latest.includes('involve') || latest.includes('need')) {
      return `Activation is simple: pick your number preference, confirm your plan, and your SIM powers on. Takes about 5 minutes.\n\nReady to start?\n[ACTION_PILLS]${JSON.stringify(['Port my current number', 'Get a new number', 'Help me pick a plan'])}[/ACTION_PILLS]`;
    }
    return msg(
      `I have a few options that could work for you. Let me walk you through the details in a moment.`,
      ['Show me options', 'Talk to someone', 'Return to home']
    );
  }

  if (turn === 3) {
    if (latest.includes('port') || latest.includes('yes') || latest.includes('activate') || latest.includes('start')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    return `Whenever you're ready, I can start activation right here.\n[ACTION_PILLS]${JSON.stringify(['Start activation', 'Port my number', 'Get a new number'])}[/ACTION_PILLS]`;
  }

  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────
// ─── Browse Intent Handler ─────────────────────────────────────────────────
function handleBrowseIntent(intent, persona) {
  const a = persona?.account;
  switch (intent) {
    case 'browse_plans': {
      const intro = a?.plan
        ? `You're currently on ${a.plan} at ${a.planPrice}. Here are all available plans:`
        : `Here are all available plans:`;
      return `${intro}\n[RECOMMENDATIONS]${JSON.stringify([
        { type: 'plan', id: 'base-5g',          reason: 'Most affordable — 5 GB of 5G data at $20/mo. No contract, no surprises.', isBest: true  },
        { type: 'plan', id: '5g-unlimited',      reason: 'Unlimited data with no caps. Includes 15 GB hotspot and Disney+ Basic.',   isBest: false },
        { type: 'plan', id: '5g-plus-unlimited', reason: 'Our top tier — premium 5G speeds, 25 GB hotspot, and Disney+ Premium.',   isBest: false },
      ])}[/RECOMMENDATIONS]`;
    }
    case 'browse_phones': {
      const intro = a?.device
        ? `You're currently using a ${a.device}. Here are phones that would be an upgrade:`
        : `Here are our available phones:`;
      return `${intro}\n[RECOMMENDATIONS]${JSON.stringify([
        { type: 'phone', id: 'samsung-galaxy-a17-5g', reason: 'Best value — free with activation. 5G capable, long battery life.',        isBest: true  },
        { type: 'phone', id: 'moto-g-stylus-2025',    reason: 'Great all-rounder — built-in stylus, sharp display, $49 after deal.',      isBest: false },
        { type: 'phone', id: 'google-pixel-10a',       reason: 'Best camera in the lineup — Google AI photography and pure Android.',     isBest: false },
      ])}[/RECOMMENDATIONS]`;
    }
    case 'browse_deals':
      return msg(
        `Here are the current deals available to you:`,
        [
          { label: 'Free Galaxy A36 with activation',  intent: 'deal_galaxy'   },
          { label: 'iPhone 17e — $0 down + plan',      intent: 'deal_iphone'   },
          { label: 'Home Internet — first month free', intent: 'deal_internet' },
          { label: 'See all deals',                    intent: 'browse_all'    },
        ]
      );
    case 'browse_rewards': {
      const pts = a?.rewardsPoints || 0;
      const expiring = a?.rewardsExpiring || 0;
      return msg(
        `You have ${pts} Rewards Points on your account.${expiring ? ` ${expiring} pts are expiring in ${a.rewardsExpiringDays} days.` : ''}\n\nYou can use your points for data add-ons, calling cards, or device discounts. Want to see what you can redeem right now?`,
        [
          { label: 'What can I redeem?',         intent: 'rewards_redeem' },
          { label: 'Add 5 GB free (1,000 pts)',  intent: 'quick_refill'   },
          { label: 'Not right now',              intent: 'cancel'          },
        ]
      );
    }
    default:
      return null;
  }
}

export function generateDemoResponse(messages, persona, activeIntent, intentTurn) {
  const userMessages = messages.filter(m => m.role === 'user');
  const turn = userMessages.length;
  const firstUserMsg = userMessages[0]?.content || '';

  // Return-to-home / end-of-flow catch — checked FIRST before any persona routing
  const lastUserMsg = (userMessages[userMessages.length - 1]?.content || '').toLowerCase();

  if (
    lastUserMsg.includes('return to home') ||
    lastUserMsg.includes("that's all") ||
    lastUserMsg.includes('thats all') ||
    lastUserMsg.includes('no thanks') ||
    lastUserMsg.includes('never mind') ||
    lastUserMsg.includes('go home')
  ) {
    return msg('Happy to help! Is there anything else you need?', POST_FLOW_PILLS);
  }

  if (
    lastUserMsg.includes('start a new topic') ||
    lastUserMsg.includes('something else') ||
    lastUserMsg.includes('what else') ||
    lastUserMsg.includes('help me with') ||
    lastUserMsg.includes('new topic')
  ) {
    return msg("Of course! What else can I help with?", ['Quick refill', 'Check my data', 'Browse phones', 'Talk to someone']);
  }

  // us-009 (Alex) always routes through his persona handler — must come before
  // handleBrowseIntent so 'browse_phones' doesn't get intercepted generically
  if (persona?.id === 'us-009') {
    if (intentTurn === 0) return getPersonaOpeningResponse(persona);
    return getAlexPhoneTurnResponse(userMessages, persona) || getGenericClarifyResponse();
  }

  // Intent-first routing: if activeIntent is a browse intent, route directly
  if (activeIntent === 'browse_plans' || activeIntent === 'browse_phones' ||
      activeIntent === 'browse_deals' || activeIntent === 'browse_rewards') {
    return handleBrowseIntent(activeIntent, persona);
  }

  // Terminal intents: done / reset — show a friendly wrap-up with escape hatches
  if (activeIntent === 'done' || activeIntent === 'reset') {
    return getGenericDoneResponse();
  }

  // Navigation catch-all: "show me everything", "browse", "what can I do" (Lam §7/§9)
  const lowerFirst = firstUserMsg.toLowerCase();
  const currentMsg = userMessages[turn - 1]?.content || '';
  const lowerCurrent = currentMsg.toLowerCase();

  // ISSUE-2.1.1 fix: only fire browse nav menu at turn 1 (guard prevents infinite loop on nav pill taps)
  const isBrowseIntent = lowerFirst.includes('show me everything') ||
    lowerFirst.includes('what can i do') ||
    lowerFirst.includes('show me all') ||
    lowerFirst.includes('browse') ||
    lowerFirst === 'menu';
  if (isBrowseIntent && turn === 1) {
    return msg(
      `Here's what I can help with today:`,
      ['View All Plans', 'Browse Phones', 'See Current Deals', 'Pay My Bill', 'Activate a Phone', 'My Account']
    );
  }

  // ISSUE-2.1.1 fix: nav pill routing for turns > 1 (user tapped a pill from the browse menu)
  if (turn > 1) {
    if (lowerCurrent === 'view all plans' || lowerCurrent === 'browse all plans') {
      const planIntro = persona?.account?.plan
        ? `You're currently on ${persona.account.plan} at ${persona.account.planPrice}. Here are all available plans:`
        : `Here are all available plans:`;
      return `${planIntro}\n[RECOMMENDATIONS]${JSON.stringify([
        { type: 'plan', id: 'base-5g', reason: 'Most affordable — 5 GB of 5G data at $20/mo. No contract, no surprises.', isBest: true },
        { type: 'plan', id: '5g-unlimited', reason: 'Unlimited data with no caps. Includes 15 GB hotspot and Disney+ Basic.', isBest: false },
        { type: 'plan', id: '5g-plus-unlimited', reason: 'Our top tier — premium 5G speeds, 25 GB hotspot, and Disney+ Premium.', isBest: false },
      ])}[/RECOMMENDATIONS]`;
    }
    if (lowerCurrent === 'browse phones') {
      const deviceIntro = persona?.account?.device
        ? `You're currently using a ${persona.account.device}. Here are phones that would be an upgrade:`
        : `Here are our available phones:`;
      return `${deviceIntro}\n[RECOMMENDATIONS]${JSON.stringify([
        { type: 'phone', id: 'samsung-galaxy-a17-5g', reason: 'Best value — free with activation. 5G capable, long battery life.', isBest: true },
        { type: 'phone', id: 'moto-g-stylus-2025', reason: 'Great all-rounder — built-in stylus, sharp display, $49 after deal.', isBest: false },
        { type: 'phone', id: 'google-pixel-10a', reason: 'Best camera in the lineup — Google AI photography and pure Android.', isBest: false },
      ])}[/RECOMMENDATIONS]`;
    }
    if (lowerCurrent === 'see current deals') {
      return msg(
        `Here are the current deals available to you:`,
        ['Free Galaxy A36 with activation', 'iPhone 17e — $0 down + plan', 'Home Internet — first month free', 'See all deals']
      );
    }
    if (lowerCurrent === 'pay my bill' || lowerCurrent === 'quick refill') {
      return `Let's get that taken care of.\n[REFILL_FLOW]`;
    }
    if (lowerCurrent === 'activate a phone' || lowerCurrent === 'activate') {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (lowerCurrent === 'my account' || lowerCurrent === 'account') {
      const a = persona?.account;
      if (a?.plan) {
        return msg(
          `Here's your account summary:\n\n📱 ${a.plan} — ${a.planPrice}\n📶 Data: ${a.dataRemaining} left of ${a.dataTotal}\n🗓️ Renews: ${a.renewalDate} (${a.daysUntilRenewal} days)\n💳 ${a.savedCard || 'No card on file'}\n⭐ Rewards: ${a.rewardsPoints || 0} pts`,
          ['Quick Refill', 'Upgrade Plan', 'Redeem Rewards', 'Something else']
        );
      }
      return msg(`What would you like to check on your account?`, ['My data usage', 'My plan', 'My rewards', 'My payment info']);
    }
  }

  // Turn 1: Check for diagnose_usage action pill first (S3-002)
  // Skip if activeIntent is already set — intent routing handles it
  if (!activeIntent && turn === 1 && persona) {
    if (isDiagnoseAction(firstUserMsg, persona)) {
      return getDiagnoseUsageResponse(persona);
    }
  }

  // ISSUE-2.1.2 fix: detect browse/plan/phone intents at turn 1 BEFORE persona opening
  // so "show me plans" doesn't fall through to Maria's refill opening
  if (turn === 1) {
    const isPlanBrowse = lowerFirst.includes('view plan') || lowerFirst.includes('show me plan') ||
      lowerFirst.includes('compare plan') || lowerFirst.includes('what plan') ||
      lowerFirst.includes('all plan') || lowerFirst === 'plans';
    const isPhoneBrowse = lowerFirst.includes('browse phone') || lowerFirst.includes('what phone') ||
      lowerFirst.includes('show me phone') || lowerFirst.includes('see phone');

    if (isPlanBrowse) {
      const a = persona?.account;
      const planIntro = a?.plan
        ? `You're currently on ${a.plan} at ${a.planPrice}. Based on your usage, here are plans that might work better:`
        : `Here are all available plans:`;
      return `${planIntro}\n[RECOMMENDATIONS]${JSON.stringify([
        { type: 'plan', id: 'base-5g', reason: 'Most affordable — 5 GB of 5G data at $20/mo. No contract, no surprises.', isBest: true },
        { type: 'plan', id: '5g-unlimited', reason: 'Unlimited data with no caps. Includes 15 GB hotspot and Disney+ Basic.', isBest: false },
        { type: 'plan', id: '5g-plus-unlimited', reason: 'Our top tier — premium 5G speeds, 25 GB hotspot, and Disney+ Premium.', isBest: false },
      ])}[/RECOMMENDATIONS]`;
    }

    if (isPhoneBrowse) {
      const a = persona?.account;
      const deviceIntro = a?.device
        ? `You're currently using a ${a.device}. Here are phones that would be an upgrade:`
        : `Here are our available phones:`;
      return `${deviceIntro}\n[RECOMMENDATIONS]${JSON.stringify([
        { type: 'phone', id: 'samsung-galaxy-a17-5g', reason: 'Best value — free with activation. 5G capable, long battery life.', isBest: true },
        { type: 'phone', id: 'moto-g-stylus-2025', reason: 'Great all-rounder — built-in stylus, sharp display, $49 after deal.', isBest: false },
        { type: 'phone', id: 'google-pixel-10a', reason: 'Best camera in the lineup — Google AI photography and pure Android.', isBest: false },
      ])}[/RECOMMENDATIONS]`;
    }
  }

  // Intent-first routing — if activeIntent is set, route to persona handler regardless of turn
  if (activeIntent && persona) {
    let response = null;
    switch (persona.id) {
      case 'us-001': response = getMariaTurnResponse(userMessages, intentTurn, activeIntent, persona); break;
      case 'us-005':
        // Angela's opening always runs first regardless of which intent pill was clicked;
        // subsequent turns fall through to getAngelaTurnResponse via the turn > 1 block below
        if (intentTurn === 0) response = getPersonaOpeningResponse(persona);
        else response = getAngelaTurnResponse(userMessages, turn, persona);
        break;
    }
    if (response) return response;
  }

  // Free-text fallback: user typed something at turn > 1 with no activeIntent.
  // Return null so the API handles unrecognized free-text instead of always
  // showing the generic clarify response.
  if (!activeIntent && turn > 1) {
    return null;
  }

  // Turn 1: Use persona-specific opening if available (only when no activeIntent)
  if (!activeIntent && turn === 1 && persona) {
    const personaResponse = getPersonaOpeningResponse(persona);
    if (personaResponse) return personaResponse;
  }

  // Turns 2+: Use persona-specific multi-turn flow handler
  if (turn > 1 && persona) {
    let response = null;
    switch (persona.id) {
      case 'us-001': response = getMariaTurnResponse(userMessages, intentTurn, activeIntent, persona); break;
      case 'us-002': response = getCarlosTurnResponse(userMessages, turn, persona); break;
      case 'us-003': response = getPriyaTurnResponse(userMessages, turn, persona); break;
      case 'us-004': response = getJamesTurnResponse(userMessages, turn, persona); break;
      case 'us-005': response = getAngelaTurnResponse(userMessages, turn, persona); break;
      case 'us-006': response = getDerekTurnResponse(userMessages, turn, persona); break;
      case 'us-007': response = getAnaTurnResponse(userMessages, turn, persona); break;
      case 'us-008': response = getRobertTurnResponse(userMessages, turn, persona); break;
      case 'us-009': response = getAlexPhoneTurnResponse(userMessages, persona); break;
      case 'us-010': response = getNinaTurnResponse(userMessages, turn, persona); break;
    }
    if (response) return response;
  }

  // ─── Generic signal-triggered fallback flows ──────────────────────
  let flowKey = getFlowKey(firstUserMsg);

  // For turns > 1, honour persona intentCategory if no persona-specific handler returned
  if (turn > 1 && persona?.intentCategory) {
    const categoryMap = { upgrade: 'upgrade', addon: 'international', compare: 'compare', refill: 'refill', activate: 'activate', byop: 'byop', support: 'support' };
    if (categoryMap[persona.intentCategory]) flowKey = categoryMap[persona.intentCategory];
  }

  // Refill generic fallback
  if (flowKey === 'refill' && turn === 2) {
    const card = persona?.account?.savedCard || 'your card on file';
    const prev = userMessages[turn - 2]?.content?.toLowerCase() || '';
    if (prev.includes('quick fix') || prev.includes('add data') || prev.includes('right now')) {
      return `Got it. Here's what I'd recommend for right now:\n\n5 GB Data Add-On — $15\nActivates instantly · Keeps your current plan intact\nCharged to ${card}\n\nWant me to go ahead with this?\n[ACTION_PILLS]${JSON.stringify(['Yes — add 5 GB for $15', 'Show other options', 'Not right now'])}[/ACTION_PILLS]`;
    }
    if (prev.includes('change') || prev.includes('plan') || prev.includes('stop')) {
      return `Makes sense. Based on your usage, you've been using well over 5 GB every month. Here's what would stop this from happening again:\n\nTotal 5G Unlimited — unlimited data, no caps · Includes Disney+\n\nYou could start now (prorated) or wait until your renewal — no charge today.\n[ACTION_PILLS]${JSON.stringify(['Start now — prorated', 'Switch at renewal', 'Stay on current plan'])}[/ACTION_PILLS]`;
    }
    return `Got it. A quick $15 refill adds 5 GB instantly — no plan change needed. Want me to set that up?\n[ACTION_PILLS]${JSON.stringify(['Yes, refill now', 'Show me other options', "I'll wait it out"])}[/ACTION_PILLS]`;
  }

  if (flowKey === 'refill' && turn === 3) {
    const prev = userMessages[turn - 2]?.content?.toLowerCase() || '';
    if (prev.includes('yes') || prev.includes('refill') || prev.includes('now') || prev.includes('add')) {
      return `Great — I'll set that up for you right now.\n[REFILL_FLOW]`;
    }
    return `No problem! Here are some other options:\n[ACTION_PILLS]${JSON.stringify(['Add 5 GB of data — $10', 'Switch to Unlimited — see current price', 'Just help me use less data'])}[/ACTION_PILLS]`;
  }

  // Upgrade generic fallback
  if (flowKey === 'upgrade' && turn === 2) {
    const prev = userMessages[turn - 2]?.content?.toLowerCase() || '';
    if (prev.includes('upgrade') || prev.includes('unlimited') || prev.includes('now')) {
      return `The Unlimited plan includes unlimited data, 15 GB hotspot, and Disney+. You can upgrade now (prorated) or wait until your next renewal.\n[ACTION_PILLS]${JSON.stringify(['Upgrade now — prorated charge', 'Upgrade at renewal — no charge today', 'Just add data for now — $10', "Show me what's included"])}[/ACTION_PILLS]`;
    }
    return `That makes sense. The Unlimited plan includes unlimited data and Disney+ Basic. Want to see a side-by-side comparison?\n[ACTION_PILLS]${JSON.stringify(['Yes, show the comparison', "What's included?", 'Not right now'])}[/ACTION_PILLS]`;
  }

  if (flowKey === 'upgrade' && turn === 3) {
    const prev = userMessages[turn - 2]?.content?.toLowerCase() || '';
    if (prev.includes('yes') || prev.includes('comparison') || prev.includes('show') || prev.includes('upgrade')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    if (prev.includes('schedule') || prev.includes('renewal') || prev.includes('lock')) {
      return `Done — your plan upgrade is scheduled for your next renewal. No charge today.\n[ACTION_PILLS]${JSON.stringify(['What else can I help with?'])}[/ACTION_PILLS]`;
    }
    return `No problem! If you change your mind, I'm here to help.\n[ACTION_PILLS]${JSON.stringify(['Tell me more about the plans', 'I want to explore other options'])}[/ACTION_PILLS]`;
  }

  // International generic fallback
  if (flowKey === 'international' && turn === 2) {
    const prev = userMessages[turn - 2]?.content?.toLowerCase() || '';
    if (prev.includes('redeem') || prev.includes('free') || prev.includes('points')) {
      return `You have ${persona?.account?.rewardsPoints || 1200} points — that's enough to redeem the Global Calling Card for free. Want to go ahead?\n[ACTION_PILLS]${JSON.stringify(['Yes, redeem my points', 'Pay $10 instead', 'Tell me more about the card'])}[/ACTION_PILLS]`;
    }
    return `With a $10/mo add-on, you could save up to $18 per month on international calls. Want to see your options?\n[ACTION_PILLS]${JSON.stringify(['Yes, show me add-ons', 'How much am I spending now?', 'Not interested'])}[/ACTION_PILLS]`;
  }

  if (flowKey === 'international' && turn === 3) {
    const prev = userMessages[turn - 2]?.content?.toLowerCase() || '';
    if (prev.includes('yes') || prev.includes('add-on') || prev.includes('show') || prev.includes('redeem')) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
    return `No worries! If you change your mind, I can always pull up international options for you.\n[ACTION_PILLS]${JSON.stringify(['Tell me more about savings', 'I have another question'])}[/ACTION_PILLS]`;
  }

  // Activation fallback
  if (flowKey === 'activate') {
    if (turn === 2) {
      const prev = userMessages[turn - 2]?.content?.toLowerCase() || '';
      if (prev.includes('port') || prev.includes('keep') || prev.includes('current number')) {
        return msg(
          `I have a few options that could work for you. Let me walk you through the details in a moment.`,
          ['Show me options', 'Talk to someone', 'Return to home']
        );
      }
      if (prev.includes('new number') || prev.includes('fresh') || prev.includes('new')) {
        return msg(
          `I have a few options that could work for you. Let me walk you through the details in a moment.`,
          ['Show me options', 'Talk to someone', 'Return to home']
        );
      }
      return `Great — let's get you connected. First: are you keeping your existing number, or would you like a new Total Wireless number?\n[ACTION_PILLS]${JSON.stringify(['Keep my existing number (port-in)', 'Get a new Total Wireless number', 'Help me choose a plan first'])}[/ACTION_PILLS]`;
    }
    if (turn === 3) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
  }

  // BYOP generic fallback
  if (flowKey === 'byop') {
    if (turn === 2) {
      const prev = userMessages[turn - 2]?.content?.toLowerCase() || '';
      if (prev.includes('check') || prev.includes('imei') || prev.includes('compatible') || prev.includes('works')) {
        return msg(
          `I have a few options that could work for you. Let me walk you through the details in a moment.`,
          ['Show me options', 'Talk to someone', 'Return to home']
        );
      }
      return `Let's check your phone's compatibility — most unlocked phones work on our network. Do you know your IMEI, or want help finding it?\n[ACTION_PILLS]${JSON.stringify(['Check compatibility now', 'Help me find my IMEI', 'Tell me about BYOP plans'])}[/ACTION_PILLS]`;
    }
    if (turn === 3) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
  }

  // Support fallback
  if (flowKey === 'support') {
    if (turn === 2) {
      const prev = userMessages[turn - 2]?.content?.toLowerCase() || '';
      if (prev.includes('home') || prev.includes('specific')) {
        return `Good to know — that helps narrow it down. No active outages are showing for your location. Let's try a couple of quick self-fix steps.\n\nHave you tried toggling Airplane mode on and off?\n[ACTION_PILLS]${JSON.stringify(['Yes, tried that — no help', "Trying it now...", 'No, let me try that', 'Already tried everything'])}[/ACTION_PILLS]`;
      }
      return `That sounds like it could be a network coverage issue rather than a device problem. Let me check for outages in your area first.\n\nNo active outages showing. Let's try a quick self-fix — have you restarted your phone in the last 24 hours?\n[ACTION_PILLS]${JSON.stringify(['Yes, still having issues', "I'll restart it now", 'Yes and it helped briefly', "Haven't restarted yet"])}[/ACTION_PILLS]`;
    }
    if (turn === 3) {
      const hour = new Date().getHours();
      const chatAvailable = hour >= 8 && hour < 22;
      const chatLine = chatAvailable ? '📞 Live Chat: Available now' : '📩 Live Chat: Opens at 8 AM — request a callback instead';
      const chatPill = chatAvailable ? 'Live Chat now' : 'Request callback tomorrow';
      return `Let me connect you with a specialist who can run deeper network diagnostics.\n\n${chatLine}\n📲 Callback: within 15 minutes\n\nWhat would you prefer?\n[ACTION_PILLS]${JSON.stringify([chatPill, 'Request callback', 'Log a support ticket', 'Show me plan options too'])}[/ACTION_PILLS]`;
    }
  }

  // Compare fallback
  if (flowKey === 'compare') {
    if (turn === 2) {
      return `Here's the key thing: at 4 lines, Total 5G Unlimited is actually cheaper per line than Total Base 5G.\n\n4 lines on Total Base: $160/mo ($40/line)\n4 lines on Unlimited: $110/mo ($27.50/line)\n\nThat's $50/mo in savings. Want to see the full comparison with all features?\n[ACTION_PILLS]${JSON.stringify(['Yes, show full comparison', 'What does Unlimited include?', 'How does family pricing work?', 'Not ready to switch'])}[/ACTION_PILLS]`;
    }
    if (turn === 3) {
      return msg(
        `I have a few options that could work for you. Let me walk you through the details in a moment.`,
        ['Show me options', 'Talk to someone', 'Return to home']
      );
    }
  }

  // Generic multi-turn flow fallback — only fires when a known flowKey matched.
  // If flowKey is null (unrecognized message), return null so the API handles it.
  if (!flowKey) return null;

  const flow = FLOWS[flowKey] || FLOWS['cost'];
  if (turn <= flow.length) {
    const step = flow[turn - 1];
    return step.pills
      ? `${step.text}\n[ACTION_PILLS]${JSON.stringify(step.pills)}[/ACTION_PILLS]`
      : step.text;
  }

  // After all questions, show recommendations
  const recs = RECOMMENDATIONS[flowKey] || RECOMMENDATIONS['cost'];
  const recText = REC_MESSAGES[flowKey] || "Based on what you've told me, here's what I'd suggest:";
  return `${recText}\n[RECOMMENDATIONS]${JSON.stringify(recs)}[/RECOMMENDATIONS]`;
}
