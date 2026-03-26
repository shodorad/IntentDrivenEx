// Persona-aware demo responses (fallback when API is unavailable)
// R1: Never ask what the provider already knows. Reference account data directly.

// ─── Persona-specific first responses ───
function getPersonaOpeningResponse(persona) {
  const a = persona?.account;
  if (!a) return null;

  switch (persona.intentCategory) {
    case 'refill': {
      // us-001 Maria or us-002 Carlos or us-003 Priya
      if (persona.id === 'us-001') {
        return `Hi ${persona.name.split(' ')[0]}. I can see you have ${a.dataRemaining} left — and your plan doesn't renew until ${a.renewalDate}, which is ${a.daysUntilRenewal} days away.\n\nI also noticed you've run out of data 11 of the last 12 months. So you're probably here for one of two reasons — quick fix for right now, or stop this from happening every month?\n[ACTION_PILLS]${JSON.stringify(['Quick fix — add data now', 'Change my plan', 'Both', 'Just checking'])}[/ACTION_PILLS]`;
      }
      if (persona.id === 'us-002') {
        return `Hi ${persona.name.split(' ')[0]}. Your plan expires in just ${a.daysUntilRenewal} days — on ${a.renewalDate}. You still have ${a.dataRemaining} left, but service will pause if not renewed.\n\nI've pre-selected your last plan (${a.plan} at ${a.planPrice}). Do you want to go ahead with that, or explore other options?\n[ACTION_PILLS]${JSON.stringify([`Renew ${a.plan} — ${a.planPrice}`, 'Upgrade to Unlimited', `Enable AutoPay & save $5/mo`, 'Show me options'])}[/ACTION_PILLS]`;
      }
      if (persona.id === 'us-003') {
        return `Hi ${persona.name.split(' ')[0]}. You're down to ${a.dataRemaining} left — and you have ${a.rewardsPoints} Rewards Points on your account, which is enough to get a free 5 GB data add-on.\n\nWould you like to use your points for the free add-on, or pay for a refill instead?\n[ACTION_PILLS]${JSON.stringify(['Redeem 1,000 pts — free 5 GB', 'Pay $15 for data add-on', 'Renew full plan early — $40', 'Show me all options'])}[/ACTION_PILLS]`;
      }
      // Generic refill
      return `I can see your data is running low — ${a.dataRemaining} left with ${a.daysUntilRenewal} days until your cycle resets. Before I set anything up, quick question: does this tend to happen most months, or is this more of a one-time thing?\n[ACTION_PILLS]${JSON.stringify(['It happens most months', 'Just this once', 'I need data right now', "I'm not sure"])}[/ACTION_PILLS]`;
    }

    case 'activate': {
      // us-004 James — new customer
      return `Welcome to Total Wireless, ${persona.name.split(' ')[0]}! I can see you have an ${a.simType || 'eSIM'} for your ${a.device}.\n\nActivating takes about 3 minutes. Would you like to set up eSIM on your ${a.device}, scan a physical SIM, or port your number from another carrier?\n[ACTION_PILLS]${JSON.stringify([`Activate eSIM on ${a.device}`, 'Scan physical SIM', 'Port my number from another carrier', 'Tell me about plans first'])}[/ACTION_PILLS]`;
    }

    case 'support': {
      // us-005 Angela — persistent connectivity issues
      return `Hi ${persona.name.split(' ')[0]}. I can see you've called support ${a.supportCallsThisMonth} times this month — and we're showing ${a.droppedCallsThisWeek} dropped calls this week and an average signal of ${a.avgSignalBars} bars. I'm sorry you're dealing with this.\n\nLet me check a couple of things first. Is this happening at a specific location — like at home or work — or is it everywhere?\n[ACTION_PILLS]${JSON.stringify(['At home or one specific place', 'Everywhere I go', 'Mostly indoors', 'It comes and goes'])}[/ACTION_PILLS]`;
    }

    case 'upgrade': {
      // us-006 Derek — hits data cap repeatedly
      return `You've hit your data cap ${a.capHitsLast3Months} months in a row — and right now you're at 0 GB. Unlimited is only $15 more per month and ends the caps permanently.\n\nWere you thinking about upgrading now, or just exploring options?\n[ACTION_PILLS]${JSON.stringify(['Upgrade to Unlimited — $55/mo', 'Start at next renewal (no charge today)', 'Add 5 GB for now — $10', "Tell me what's included"])}[/ACTION_PILLS]`;
    }

    case 'addon': {
      // us-007 Ana — international caller
      const intlCalls = a.internationalCallsThisMonth || [];
      const topCountry = intlCalls[0]?.country || 'Colombia';
      const callCount = intlCalls[0]?.callCount || 8;
      return `Hi ${persona.name.split(' ')[0]}. I noticed you called ${topCountry} ${callCount} times this month — the $10 Global Calling Card could save you up to $18/mo on those calls.\n\nAnd I see you have ${a.rewardsPoints} Rewards Points — that's enough to get it for free. Want to redeem your points, or would you prefer to pay?\n[ACTION_PILLS]${JSON.stringify([`Redeem 1,000 pts — free Calling Card`, 'Add Calling Card — $10/mo', 'See all add-ons', "How much am I spending now?"])}[/ACTION_PILLS]`;
    }

    case 'compare': {
      // us-008 Robert — comparing plans, 4-line family
      return `Hi ${persona.name.split(' ')[0]}. I can see you manage ${a.familyLines} lines and you've visited the Plans page ${a.planPageVisitsThisWeek} times this week — looks like you're doing some comparison shopping.\n\nRight now all 4 lines are on ${a.plan} at $${a.currentMonthlySpend}/mo total. Unlimited at 4 lines would be $110/mo — $50 cheaper per month.\n\nWant to see a full side-by-side comparison?\n[ACTION_PILLS]${JSON.stringify(['See side-by-side comparison', 'Calculate family pricing', 'What does Unlimited include?', 'How does the price guarantee work?'])}[/ACTION_PILLS]`;
    }

    default:
      return null;
  }
}

// ─── Generic multi-turn flows (fallback for non-persona or later turns) ───
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
    { type: "plan", id: "value-40", reason: "The Value Plan gives you 15GB of high-speed 5G data for $40/mo. That's a solid upgrade that should handle your browsing and social media without throttling.", isBest: true, costDiff: "+$15/mo vs Connect", solveHighlight: "+10GB data = no more throttling" },
    { type: "plan", id: "unlimited-50", reason: "If you want to never think about speed limits, the Unlimited Plan at $50/mo gives you unlimited high-speed data plus 10GB hotspot.", isBest: false, costDiff: "+$25/mo vs Connect", solveHighlight: "Unlimited data = zero speed limits" },
    { type: "plan", id: "unlimited-plus-60", reason: "For the absolute fastest speeds, the Unlimited+ Plan at $60/mo includes 5G Ultra Wideband access and 25GB hotspot.", isBest: false, costDiff: "+$35/mo vs Connect", solveHighlight: "5G Ultra Wideband = fastest speeds available" },
  ],
  'runs-out': [
    { type: "plan", id: "unlimited-50", reason: "The Unlimited Plan at $50/mo means you'll never run out of data again. Zero cap, zero surprises, plus 10GB of hotspot included.", isBest: true, costDiff: "+$25/mo vs Connect", solveHighlight: "Unlimited = never run out again" },
    { type: "plan", id: "value-40", reason: "If you want to save a bit, the Value Plan at $40/mo gives you 15GB — that's triple what most basic plans offer and includes 5GB hotspot.", isBest: false, costDiff: "+$15/mo vs Connect", solveHighlight: "+10GB = 3× more data" },
    { type: "plan", id: "unlimited-plus-60", reason: "For heavy users who also hotspot a lot, the Unlimited+ Plan at $60/mo adds 25GB hotspot and premium 5G Ultra Wideband speeds.", isBest: false, costDiff: "+$35/mo vs Connect", solveHighlight: "25GB hotspot + premium 5G" },
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
    { type: "plan", id: "connect-25", reason: "At just $25/mo, the Connect Plan gives you unlimited talk & text with 1GB of data.", isBest: true, costDiff: "$25/mo", solveHighlight: "Lowest bill — just $25/mo" },
    { type: "plan", id: "basic-30", reason: "For only $5 more at $30/mo, the Basic Plan gives you 5GB of data and a mobile hotspot.", isBest: false, costDiff: "+$5/mo vs Connect", solveHighlight: "+4GB data for just $5 more" },
    { type: "plan", id: "value-40", reason: "The Value Plan at $40/mo is our most popular — 15GB of data, 5GB hotspot, and international texting.", isBest: false, costDiff: "+$15/mo vs Connect", solveHighlight: "15GB + hotspot = best bang for buck" },
  ],
  'new-phone': [
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 at $199 is the best all-rounder — 50MP camera with OIS, 6GB RAM, gorgeous Super AMOLED display, and 5000mAh battery.", isBest: true, costDiff: "$199", solveHighlight: "Best all-rounder — camera, speed & battery" },
    { type: "phone", id: "moto-g-power", reason: "If budget is a priority, the Moto G Power at $99 delivers solid performance, a massive battery, and 128GB storage.", isBest: false, costDiff: "$99", solveHighlight: "Best value — solid performance for $99" },
    { type: "phone", id: "iphone-se", reason: "For Apple fans, the iPhone SE at $249 packs the powerful A15 Bionic chip, 5G capability, and the full iOS ecosystem.", isBest: false, costDiff: "$249", solveHighlight: "Full Apple ecosystem + A15 chip" },
  ],
  'not-working': [
    { type: "human", reason: "Based on what you've described, I think our support specialists can help troubleshoot this faster. They can check your account, run network diagnostics, and resolve most issues on the spot.", isBest: true },
    { type: "plan", id: "value-40", reason: "If your current plan is causing data or connectivity issues, the Value Plan at $40/mo offers 15GB of reliable 5G data.", isBest: false, costDiff: "+$15/mo vs Connect", solveHighlight: "15GB reliable 5G = fewer connectivity issues" },
    { type: "phone", id: "moto-g-power", reason: "If your phone itself is the problem, the Moto G Power at $99 is a dependable, budget-friendly replacement.", isBest: false, costDiff: "$99", solveHighlight: "Reliable replacement with 5G support" },
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
  const msg = firstMessage.toLowerCase();

  // Signal-triggered flows
  if (msg.includes('refill') || msg.includes('renew') || msg.includes('expir') || msg.includes('autopay')) return 'refill';
  if (msg.includes('upgrade') || msg.includes('unlimited') || msg.includes('55/mo') || (msg.includes('upgrade') && msg.includes('plan'))) return 'upgrade';
  if (msg.includes('international') || msg.includes('calling card') || msg.includes('colombia') || msg.includes('global call')) return 'international';
  if (msg.includes('activate') && (msg.includes('sim') || msg.includes('esim'))) return 'activate';
  if (msg.includes('connectivity') || msg.includes('support') || msg.includes('signal') || msg.includes('outage') || msg.includes('dropped')) return 'support';
  if (msg.includes('compare') || (msg.includes('side') && msg.includes('side')) || msg.includes('family pric')) return 'compare';

  if (msg.includes('slow') && (msg.includes('data') || msg.includes('internet') || msg.includes('speed'))) return 'slow-data';
  if (msg.includes('run out') || msg.includes('runs out') || (msg.includes('data') && msg.includes('end of'))) return 'runs-out';
  if (msg.includes('sluggish') || (msg.includes('slow') && msg.includes('phone'))) return 'slow-phone';
  if (msg.includes('storage') || msg.includes('space') || msg.includes('full')) return 'storage';
  if (msg.includes('photo') || msg.includes('picture') || msg.includes('camera')) return 'camera';
  if (msg.includes('cheap') || msg.includes('cost') || msg.includes('spend less') || msg.includes('save') || msg.includes('affordable')) return 'cost';
  if (msg.includes('new phone') || msg.includes('upgrade') || msg.includes('replace') || msg.includes('thinking about getting')) return 'new-phone';
  if (msg.includes('not working') || msg.includes("isn't working") || msg.includes('broken') || msg.includes('dropping') || msg.includes("can't connect")) return 'not-working';

  return 'cost'; // default fallback
}

export function generateDemoResponse(messages, persona) {
  const userMessages = messages.filter(m => m.role === 'user');
  const turn = userMessages.length;
  const firstUserMsg = userMessages[0]?.content || '';

  // intentCategory override: for turns > 1, honour persona intent before keyword detection
  // This ensures pill labels like "Upgrade to Unlimited" correctly route Derek's flow
  let flowKey = getFlowKey(firstUserMsg);
  if (turn > 1 && persona?.intentCategory) {
    const categoryMap = {
      'upgrade': 'upgrade',
      'addon': 'international',
      'compare': 'compare',
      'refill': 'refill',
      'activate': 'activate',
      'support': 'support',
    };
    if (categoryMap[persona.intentCategory]) {
      flowKey = categoryMap[persona.intentCategory];
    }
  }

  // ─── Turn 1: Use persona-specific opening if available ───
  if (turn === 1 && persona) {
    const personaResponse = getPersonaOpeningResponse(persona);
    if (personaResponse) return personaResponse;
  }

  // ─── Signal-triggered flows with persona context ───

  // Refill flow (persona-aware follow-ups)
  if (flowKey === 'refill' && turn === 2) {
    const lastMsg = userMessages[1]?.content?.toLowerCase() || '';
    if (lastMsg.includes('quick fix') || lastMsg.includes('add data') || lastMsg.includes('right now')) {
      const card = persona?.account?.savedCard || 'your card on file';
      return `Got it. Here's what I'd recommend for right now:\n\n5 GB Data Add-On — $15\nActivates instantly · Keeps your current plan intact\nCharged to ${card}\n\nWant me to go ahead with this?\n[ACTION_PILLS]${JSON.stringify(['Yes — add 5 GB for $15', 'Show other options', 'Not right now'])}[/ACTION_PILLS]`;
    }
    if (lastMsg.includes('change') || lastMsg.includes('plan') || lastMsg.includes('stop')) {
      return `Makes sense. Based on your usage, you've been using well over 5 GB every month. Here's what would stop this from happening again:\n\nTotal 5G Unlimited — $55/mo\nUnlimited data, no caps · Includes Disney+\n\nYou could start now (prorated) or wait until your renewal — no charge today.\n[ACTION_PILLS]${JSON.stringify(['Start now — prorated', 'Switch at renewal', 'Stay on current plan'])}[/ACTION_PILLS]`;
    }
    return `Got it. A quick $15 refill adds 5 GB instantly — no plan change needed. Want me to set that up?\n[ACTION_PILLS]${JSON.stringify(['Yes, refill now', 'Show me other options', "I'll wait it out"])}[/ACTION_PILLS]`;
  }

  if (flowKey === 'refill' && turn === 3) {
    const lastMsg = userMessages[2]?.content?.toLowerCase() || '';
    if (lastMsg.includes('yes') || lastMsg.includes('refill') || lastMsg.includes('now') || lastMsg.includes('add')) {
      return `Great — I'll set that up for you right now.\n[REFILL_FLOW]`;
    }
    return `No problem! Here are some other options for your data situation:\n[ACTION_PILLS]${JSON.stringify(['Add a 5 GB booster for $15', 'Switch to Unlimited for $55/mo', 'Just help me use less data'])}[/ACTION_PILLS]`;
  }

  // Upgrade flow (us-006 Derek — always persona-aware)
  if (flowKey === 'upgrade' && turn === 2) {
    const lastMsg = userMessages[1]?.content?.toLowerCase() || '';
    if (lastMsg.includes('upgrade') || lastMsg.includes('unlimited') || lastMsg.includes('now')) {
      return `The Unlimited plan is $55/mo — only $15 more than what you pay now, and it includes Disney+. You can upgrade now (prorated for the days remaining in your cycle) or wait until your next renewal.\n\nWhich works better for you?\n[ACTION_PILLS]${JSON.stringify(['Upgrade now — prorated charge', 'Upgrade at renewal — no charge today', 'Just add data for now — $10', 'Show me what is included'])}[/ACTION_PILLS]`;
    }
    if (lastMsg.includes('renewal') || lastMsg.includes('start at')) {
      return `Perfect. I'll schedule the upgrade to Total 5G Unlimited to start on your next renewal date. No charge today — you'll pay $55 when your current cycle ends.\n\nShould I lock that in?\n[ACTION_PILLS]${JSON.stringify(['Yes, schedule upgrade', 'Cancel — keep current plan'])}[/ACTION_PILLS]`;
    }
    return `That makes sense. The Unlimited plan is only $15 more per month — and it includes Disney+ Basic. Want to see a side-by-side comparison?\n[ACTION_PILLS]${JSON.stringify(['Yes, show the comparison', 'What else is included?', 'Not right now'])}[/ACTION_PILLS]`;
  }

  if (flowKey === 'upgrade' && turn === 3) {
    const lastMsg = userMessages[2]?.content?.toLowerCase() || '';
    if (lastMsg.includes('yes') || lastMsg.includes('comparison') || lastMsg.includes('show') || lastMsg.includes('upgrade')) {
      return `Here's a side-by-side comparison of your current plan versus Unlimited:\n[UPGRADE_FLOW]`;
    }
    if (lastMsg.includes('schedule') || lastMsg.includes('renewal') || lastMsg.includes('lock')) {
      return `Done — your plan upgrade is scheduled for your next renewal. No charge today.\n[ACTION_PILLS]${JSON.stringify(['What else can I help with?'])}[/ACTION_PILLS]`;
    }
    return `No problem! Your current plan still works. If you change your mind, I'm here to help.\n[ACTION_PILLS]${JSON.stringify(['Tell me more about the plans', 'I want to explore other options'])}[/ACTION_PILLS]`;
  }

  // International flow (us-007 Ana)
  if (flowKey === 'international' && turn === 2) {
    const lastMsg = userMessages[1]?.content?.toLowerCase() || '';
    if (lastMsg.includes('redeem') || lastMsg.includes('free') || lastMsg.includes('points')) {
      return `You have ${persona?.account?.rewardsPoints || 1200} points — that's enough to redeem the Global Calling Card for free. Want to go ahead?\n[ACTION_PILLS]${JSON.stringify(['Yes, redeem my points', 'Pay $10 instead', 'Tell me more about the card'])}[/ACTION_PILLS]`;
    }
    return `Got it. With a $10/mo add-on, you could save up to $18 per month on international calls. Want to see your options?\n[ACTION_PILLS]${JSON.stringify(['Yes, show me add-ons', 'How much am I spending now?', 'Not interested'])}[/ACTION_PILLS]`;
  }

  if (flowKey === 'international' && turn === 3) {
    const lastMsg = userMessages[2]?.content?.toLowerCase() || '';
    if (lastMsg.includes('yes') || lastMsg.includes('add-on') || lastMsg.includes('show') || lastMsg.includes('redeem')) {
      return `Here are the international add-ons that match your calling patterns:\n[INTERNATIONAL_FLOW]`;
    }
    return `No worries! If you change your mind, I can always pull up international options for you.\n[ACTION_PILLS]${JSON.stringify(['Tell me more about savings', 'I have another question'])}[/ACTION_PILLS]`;
  }

  // Activation flow (us-004 James)
  if (flowKey === 'activate') {
    if (turn === 2) {
      return `Great choice — eSIM setup for iPhone 15 Pro is fast and seamless. I'll walk you through it step by step.\n\nFirst, let me know: are you keeping your existing number from another carrier, or would you like a new Total Wireless number?\n[ACTION_PILLS]${JSON.stringify(['Keep my existing number (port-in)', 'Get a new Total Wireless number', 'I already have a Total Wireless number'])}[/ACTION_PILLS]`;
    }
    if (turn === 3) {
      return `Got it. Let's get you set up with a new number. Which plan would you like to start with?\n[ACTION_PILLS]${JSON.stringify(['Total Base 5G — $40/mo', 'Total 5G Unlimited — $55/mo', 'See all plans', 'Help me choose'])}[/ACTION_PILLS]`;
    }
  }

  // Support flow (us-005 Angela)
  if (flowKey === 'support') {
    if (turn === 2) {
      const lastMsg = userMessages[1]?.content?.toLowerCase() || '';
      if (lastMsg.includes('home') || lastMsg.includes('specific')) {
        return `Good to know — that helps narrow it down. Let me first check if there are any known network issues or outages in your area. One moment...\n\nNo active outages are showing for your location. Let's try a couple of quick self-fix steps. Have you tried toggling Airplane mode on and off?\n[ACTION_PILLS]${JSON.stringify(['Yes, tried that — no help', "Trying it now...", 'No, let me try that', 'Already tried everything'])}[/ACTION_PILLS]`;
      }
      return `That sounds like it could be a network coverage issue rather than a device problem. Let me check for outages in your area first.\n\nNo active outages showing. Let's try a quick self-fix — have you restarted your phone in the last 24 hours?\n[ACTION_PILLS]${JSON.stringify(['Yes, still having issues', "I'll restart it now", 'Yes and it helped briefly', "Haven't restarted yet"])}[/ACTION_PILLS]`;
    }
    if (turn === 3) {
      const hour = new Date().getHours();
      const chatAvailable = hour >= 8 && hour < 22; // support hours 8AM–10PM
      const chatLine = chatAvailable
        ? '📞 Live Chat: Available now'
        : '📩 Live Chat: Opens at 8 AM — request a callback instead';
      const chatPill = chatAvailable ? 'Live Chat now' : 'Request callback tomorrow';
      return `I understand this is really frustrating — especially after calling 5 times. Let me connect you with a specialist who can run deeper network diagnostics on your account.\n\n${chatLine}\n📲 Callback: within 15 minutes\n\nOr I can log a formal support ticket so this is tracked. What would you prefer?\n[ACTION_PILLS]${JSON.stringify([chatPill, 'Request callback', 'Log a support ticket', 'Show me plan options too'])}[/ACTION_PILLS]`;
    }
  }

  // Compare plans flow (us-008 Robert)
  if (flowKey === 'compare') {
    if (turn === 2) {
      return `Here's the key thing: at 4 lines, Total 5G Unlimited is actually cheaper per line than Total Base 5G.\n\n4 lines on Total Base: $160/mo ($40/line)\n4 lines on Unlimited: $110/mo ($27.50/line)\n\nThat's $50/mo in savings. Want to see the full comparison with all features?\n[ACTION_PILLS]${JSON.stringify(['Yes, show full comparison', 'What does Unlimited include?', 'How does family pricing work?', 'Not ready to switch'])}[/ACTION_PILLS]`;
    }
    if (turn === 3) {
      return `Here's a full side-by-side for your 4 lines:\n[UPGRADE_FLOW]`;
    }
  }

  // Generic multi-turn flow
  const flow = FLOWS[flowKey] || FLOWS['cost'];
  if (turn <= flow.length) {
    const step = flow[turn - 1];
    let response = step.text;
    if (step.pills) {
      response += `\n[ACTION_PILLS]${JSON.stringify(step.pills)}[/ACTION_PILLS]`;
    }
    return response;
  }

  // After all questions, show recommendations
  const recs = RECOMMENDATIONS[flowKey] || RECOMMENDATIONS['cost'];
  const recText = REC_MESSAGES[flowKey] || "Based on what you've told me, here's what I'd suggest:";
  return `${recText}\n[RECOMMENDATIONS]${JSON.stringify(recs)}[/RECOMMENDATIONS]`;
}
