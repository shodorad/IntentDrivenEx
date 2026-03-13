// Fallback responses when no API key is configured (demo mode)

const FLOWS = {
  'slow-data': [
    {
      text: "Got it — slow data is frustrating. When does it feel the slowest? Is it happening all the time, or more at certain times of day?",
      pills: ["All the time", "Mostly evenings", "When I'm out and about", "It just started recently"]
    },
    {
      text: "That helps. Do you know what plan you're on right now — specifically how much data you get each month?",
      pills: ["5 GB or less", "10-15 GB", "20+ GB", "Not sure"]
    },
    {
      text: "And what are you mainly using your data for? That'll help me figure out if it's a coverage thing or a data thing.",
      pills: ["Social media & browsing", "Streaming video", "Calls & texts mostly", "A bit of everything"]
    }
  ],
  'runs-out': [
    {
      text: "Running out of data is the worst. How early in the month does it usually happen?",
      pills: ["First two weeks", "Around week three", "Last few days", "It varies"]
    },
    {
      text: "And how much data does your current plan give you?",
      pills: ["5 GB or less", "10-15 GB", "20+ GB", "Not sure"]
    },
    {
      text: "What eats up most of your data? That'll help me figure out the right amount for you.",
      pills: ["Streaming video", "Social media", "Video calls", "A bit of everything"]
    }
  ],
  'default': [
    {
      text: "Thanks for letting me know. Can you tell me a bit more about what's going on? What's the main issue you're running into?",
      pills: ["Data issues", "Phone is slow", "Want to save money", "Need a new phone"]
    },
    {
      text: "Got it. What plan are you currently on — do you know how much data you get?",
      pills: ["5 GB or less", "10-15 GB", "20+ GB", "Not sure"]
    },
    {
      text: "And what do you mainly use your phone for? That'll help me find the right fit.",
      pills: ["Calls & texts mostly", "Social media", "Streaming & video", "A bit of everything"]
    }
  ]
};

const RECOMMENDATIONS = {
  data: [
    { type: "plan", id: "value-40", reason: "The Value Plan gives you 15GB of high-speed data for $40/mo — that should handle your daily browsing and social media without running out.", isBest: true },
    { type: "plan", id: "unlimited-50", reason: "If you want zero worries about data, the Unlimited Plan is only $10 more at $50/mo with no data cap.", isBest: false }
  ],
  cost: [
    { type: "plan", id: "connect-25", reason: "At $25/mo, the Connect Plan covers unlimited talk & text with 1GB of data — perfect if you're mainly on Wi-Fi.", isBest: true },
    { type: "plan", id: "basic-30", reason: "For just $5 more, the Basic Plan bumps you to 5GB which gives more breathing room when you're off Wi-Fi.", isBest: false }
  ],
  phone: [
    { type: "phone", id: "moto-g-power", reason: "The Moto G Power at $99 gives you solid performance, a big battery, and 128GB storage. Best bang for your buck.", isBest: true },
    { type: "phone", id: "samsung-a25", reason: "If you want a better display and camera, the Galaxy A25 at $199 is a great all-around upgrade with 6GB RAM.", isBest: false }
  ],
  camera: [
    { type: "phone", id: "samsung-a15", reason: "The Galaxy A15 at $139 has a 50MP camera and a gorgeous AMOLED display — great photos without breaking the bank.", isBest: true },
    { type: "phone", id: "samsung-a25", reason: "For $60 more, the Galaxy A25 adds optical image stabilization for sharper photos, especially in low light.", isBest: false }
  ],
  storage: [
    { type: "phone", id: "moto-g-stylus", reason: "The Moto G Stylus has 256GB of storage built in — double what most phones offer. Should solve your storage issues for good.", isBest: true },
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 has 128GB plus a microSD slot for expansion if you need even more down the road.", isBest: false }
  ]
};

function getRecCategory(history) {
  const all = history.map(m => m.content.toLowerCase()).join(' ');
  if (all.includes('photo') || all.includes('camera') || all.includes('picture')) return 'camera';
  if (all.includes('storage') || all.includes('space') || all.includes('full')) return 'storage';
  if (all.includes('slow') && (all.includes('phone') || all.includes('sluggish') || all.includes('laggy'))) return 'phone';
  if (all.includes('new phone') || all.includes('upgrade') || all.includes('replace')) return 'phone';
  if (all.includes('cheap') || all.includes('cost') || all.includes('spend less') || all.includes('save')) return 'cost';
  return 'data';
}

function getFlowKey(firstMessage) {
  const msg = firstMessage.toLowerCase();
  if (msg.includes('slow') && (msg.includes('data') || msg.includes('internet') || msg.includes('speed'))) return 'slow-data';
  if (msg.includes('run out') || msg.includes('runs out') || msg.includes('data') && msg.includes('end of')) return 'runs-out';
  return 'default';
}

export function generateDemoResponse(messages) {
  const userMessages = messages.filter(m => m.role === 'user');
  const turn = userMessages.length;
  const firstUserMsg = userMessages[0]?.content || '';
  const flowKey = getFlowKey(firstUserMsg);
  const flow = FLOWS[flowKey] || FLOWS['default'];

  if (turn <= flow.length) {
    const step = flow[turn - 1];
    let response = step.text;
    if (step.pills) {
      response += `\n[ACTION_PILLS]${JSON.stringify(step.pills)}[/ACTION_PILLS]`;
    }
    return response;
  }

  // After enough questions, recommend
  const category = getRecCategory(messages);
  const recs = RECOMMENDATIONS[category] || RECOMMENDATIONS['data'];
  const recText = "Based on what you've told me, here's what I'd suggest:";
  return `${recText}\n[RECOMMENDATIONS]${JSON.stringify(recs)}[/RECOMMENDATIONS]`;
}
