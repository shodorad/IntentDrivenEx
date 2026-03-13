// Fallback responses when no API key is configured (demo mode)
// Each intent pill has its own unique conversation flow with 3-4 contextual questions

const PHONE_PREVIEWS = [
  { name: "Moto G Power", price: 99, image: "https://m.media-amazon.com/images/I/61c9OZyq2yL._AC_SX679_.jpg" },
  { name: "Galaxy A15", price: 139, image: "https://m.media-amazon.com/images/I/41vU1u8DZXL._AC_SX679_.jpg" },
  { name: "Galaxy A25", price: 199, image: "https://m.media-amazon.com/images/I/61cwMOVn17L._AC_SX679_.jpg" },
  { name: "iPhone SE", price: 249, image: "https://m.media-amazon.com/images/I/61-wAIWB8NL._AC_SX679_.jpg" }
];

const FLOWS = {
  // ─── "My internet is slow" ───
  'slow-data': [
    {
      text: "Got it — slow data is really frustrating. Let me help figure out what's going on. When does it feel the slowest?",
      pills: ["All the time", "Mostly evenings", "When I'm out and about", "It just started recently"]
    },
    {
      text: "That's helpful. Are you noticing it with specific apps, or is everything slow — like loading websites, maps, all of it?",
      pills: ["Specific apps like video or social media", "Everything is slow", "Mostly browsing and email", "Maps and navigation"]
    },
    {
      text: "One more thing — do you know how much data your current plan gives you? Sometimes slowdowns happen after you've used your high-speed data for the month.",
      pills: ["1-5 GB", "10-15 GB", "Unlimited", "I'm not sure"]
    },
    {
      text: "Last question — are you usually on Wi-Fi at home, or do you rely mostly on cellular data throughout the day?",
      pills: ["Mostly Wi-Fi at home", "Mostly cellular data", "About 50/50", "I don't have Wi-Fi at home"]
    }
  ],

  // ─── "I run out of data" ───
  'runs-out': [
    {
      text: "Running out of data before the month is over is the worst. How early in your billing cycle does it usually happen?",
      pills: ["Within the first two weeks", "Around week three", "Just the last few days", "It's unpredictable"]
    },
    {
      text: "And how much data does your current plan include? That'll help me understand if you need a bigger bump or just a small upgrade.",
      pills: ["1 GB", "5 GB", "10-15 GB", "I'm not sure"]
    },
    {
      text: "What do you think is eating up most of your data? Sometimes one app or habit is the main culprit.",
      pills: ["Streaming video (YouTube, Netflix)", "Social media (TikTok, Instagram)", "Video calls (FaceTime, Zoom)", "I honestly don't know"]
    },
    {
      text: "Do you also use your phone as a hotspot — like connecting your laptop or tablet to your phone's data?",
      pills: ["Yes, regularly", "Occasionally", "No, never", "I didn't know I could do that"]
    }
  ],

  // ─── "My phone feels slow" ───
  'slow-phone': [
    {
      text: "A slow phone is really annoying. Let me ask a few questions to figure out what might help. How old is your current phone?",
      pills: ["Less than a year", "1-2 years", "3-4 years", "5+ years or not sure"]
    },
    {
      text: "What kind of phone are you using right now? That'll help me understand what we're working with.",
      pills: ["iPhone (older model)", "iPhone (recent model)", "Samsung Galaxy", "Another Android phone"]
    },
    {
      text: "When it feels slow, what's usually happening — is it when you open apps, switch between things, or all the time?",
      pills: ["Apps take forever to open", "Switching between apps is laggy", "The whole phone freezes up", "Camera is slow or glitchy"]
    },
    {
      text: "One more thing — is your phone storage almost full? That can actually cause a lot of slowness.",
      pills: ["Yes, it says storage is almost full", "I have some space left", "Plenty of space", "I don't know how to check"]
    }
  ],

  // ─── "Running out of storage" ───
  'storage': [
    {
      text: "Running out of storage is a pain — especially when you can't take photos or download anything. What's taking up the most space on your phone?",
      pills: ["Photos and videos", "Apps and games", "Messages and downloads", "I'm not sure"]
    },
    {
      text: "How much storage does your current phone have? You can usually find this in Settings.",
      pills: ["32 GB or less", "64 GB", "128 GB", "I don't know"]
    },
    {
      text: "Have you tried clearing old files or offloading apps, or are you at the point where you need a phone with more built-in storage? Here are some phones with great storage options:",
      pills: ["I've tried clearing stuff, still full", "I clear it but it fills back up", "I haven't tried yet", "I'd rather just get more storage"],
      productImages: PHONE_PREVIEWS
    },
    {
      text: "Would you prefer a phone with expandable storage (microSD card slot) so you can add more later, or is built-in storage fine?",
      pills: ["Expandable storage sounds great", "Built-in is fine if it's enough", "I don't have a preference", "What's the difference?"]
    }
  ],

  // ─── "I want better photos" ───
  'camera': [
    {
      text: "Better photos — I can help with that! What kind of photos do you take most often?",
      pills: ["Family and friends", "Nature and landscapes", "Food and products", "A bit of everything"]
    },
    {
      text: "What bothers you most about your current phone's camera? That'll help me narrow down what matters.",
      pills: ["Blurry photos", "Bad in low light", "Colors look washed out", "No zoom or portrait mode"]
    },
    {
      text: "Do you also shoot a lot of video, or is it mainly photos?",
      pills: ["Mostly photos", "Lots of video too", "About equal", "I mainly just do selfies"]
    },
    {
      text: "And what's your budget range for a new phone? Here are some top camera phones in different price ranges:",
      pills: ["Under $150", "$150 - $250", "$250 - $400", "I'm flexible on budget"],
      productImages: PHONE_PREVIEWS
    }
  ],

  // ─── "I want to spend less" ───
  'cost': [
    {
      text: "Saving money is smart — let me find you the best value. Do you know roughly how much you're paying per month right now?",
      pills: ["Around $30-40", "Around $50-60", "Over $60", "I'm not sure"]
    },
    {
      text: "What do you mainly use your phone for on a daily basis? That'll help me figure out what plan features you actually need.",
      pills: ["Calls and texts mostly", "Social media and browsing", "Streaming music or video", "A bit of everything"]
    },
    {
      text: "How much data do you realistically need each month? If you're mostly on Wi-Fi, you might be paying for data you don't use.",
      pills: ["I barely use any data", "A few GB is probably fine", "I need at least 10-15 GB", "I'm a heavy data user"]
    },
    {
      text: "Are you also looking at getting a new phone, or just want a cheaper plan for the phone you already have?",
      pills: ["Just a cheaper plan", "Cheaper plan + new phone", "Mainly need a new affordable phone", "I want to save on everything"]
    }
  ],

  // ─── "I need a new phone" ───
  'new-phone': [
    {
      text: "Exciting! Let me help you find the right one. What's the main reason you're looking for a new phone?",
      pills: ["Current phone is too slow", "Screen is cracked or damaged", "I want better features", "It's just time for an upgrade"]
    },
    {
      text: "What matters most to you in a new phone? Everyone's different — I want to match you with the right one.",
      pills: ["Great camera", "Long battery life", "Lots of storage", "Best overall performance"]
    },
    {
      text: "Do you have a brand preference, or are you open to anything? Here's a preview of what's available:",
      pills: ["I prefer iPhone", "I prefer Samsung", "I'm open to any brand", "Whatever gives the best value"],
      productImages: PHONE_PREVIEWS
    },
    {
      text: "And what's your budget looking like? I'll find the best option in your range.",
      pills: ["Under $100", "$100 - $200", "$200 - $300", "I'm flexible"]
    }
  ],

  // ─── "Something isn't working" ───
  'not-working': [
    {
      text: "Sorry to hear something's not right. Can you tell me more about what's going on?",
      pills: ["Calls dropping or no signal", "Texts not sending", "Can't connect to internet", "Phone keeps crashing or restarting"]
    },
    {
      text: "How long has this been happening? That helps me figure out if it's a recent change or an ongoing thing.",
      pills: ["Just started today", "A few days now", "It's been weeks", "It comes and goes"]
    },
    {
      text: "Have you tried restarting your phone or toggling airplane mode on and off? Sometimes that clears things up.",
      pills: ["Yes, didn't help", "Yes, it helped temporarily", "No, I haven't tried that", "I've tried everything"]
    },
    {
      text: "Based on what you're describing, this might be something our support team can troubleshoot more deeply. But let me also check if a plan or device change might help. What phone are you using?",
      pills: ["An older iPhone", "A recent iPhone", "A Samsung Galaxy", "Another Android phone"]
    }
  ]
};

// ─── Recommendations (3 options each) ───
const RECOMMENDATIONS = {
  'slow-data': [
    { type: "plan", id: "value-40", reason: "The Value Plan gives you 15GB of high-speed 5G data for $40/mo. That's a solid upgrade that should handle your browsing and social media without throttling.", isBest: true },
    { type: "plan", id: "unlimited-50", reason: "If you want to never think about speed limits, the Unlimited Plan at $50/mo gives you unlimited high-speed data plus 10GB hotspot.", isBest: false },
    { type: "plan", id: "unlimited-plus-60", reason: "For the absolute fastest speeds, the Unlimited+ Plan at $60/mo includes 5G Ultra Wideband access and 25GB hotspot.", isBest: false }
  ],
  'runs-out': [
    { type: "plan", id: "unlimited-50", reason: "The Unlimited Plan at $50/mo means you'll never run out of data again. Zero cap, zero surprises, plus 10GB of hotspot included.", isBest: true },
    { type: "plan", id: "value-40", reason: "If you want to save a bit, the Value Plan at $40/mo gives you 15GB — that's triple what most basic plans offer and includes 5GB hotspot.", isBest: false },
    { type: "plan", id: "unlimited-plus-60", reason: "For heavy users who also hotspot a lot, the Unlimited+ Plan at $60/mo adds 25GB hotspot and premium 5G Ultra Wideband speeds.", isBest: false }
  ],
  'slow-phone': [
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 at $199 has 6GB RAM and a fast processor — a major upgrade that'll make everything feel snappy and responsive again.", isBest: true },
    { type: "phone", id: "moto-g-power", reason: "The Moto G Power at just $99 gives you solid performance with 128GB storage and a huge battery. Great value if you want a noticeable speed boost.", isBest: false },
    { type: "phone", id: "iphone-se", reason: "If you prefer Apple, the iPhone SE at $249 has the A15 Bionic chip — the same one in much more expensive iPhones. Incredibly fast for the price.", isBest: false }
  ],
  'storage': [
    { type: "phone", id: "moto-g-stylus", reason: "The Moto G Stylus has 256GB of built-in storage — double most phones at this price. You'll have room for thousands of photos and dozens of apps.", isBest: true },
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 at $199 has 128GB built in, plus a microSD card slot so you can expand to 1TB. Best of both worlds.", isBest: false },
    { type: "phone", id: "samsung-a15", reason: "The Galaxy A15 at $139 gives you 128GB of storage with a great AMOLED display. Solid option if you want more space without spending too much.", isBest: false }
  ],
  'camera': [
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 at $199 has a 50MP camera with optical image stabilization — your photos will be sharper, even in low light. Plus a stunning Super AMOLED display.", isBest: true },
    { type: "phone", id: "samsung-a15", reason: "The Galaxy A15 at $139 has the same 50MP sensor and a gorgeous AMOLED display. Great photos at a lower price point.", isBest: false },
    { type: "phone", id: "iphone-se", reason: "If you love Apple's photo processing, the iPhone SE at $249 takes incredible photos with Portrait mode and Smart HDR despite having a 12MP sensor.", isBest: false }
  ],
  'cost': [
    { type: "plan", id: "connect-25", reason: "At just $25/mo, the Connect Plan gives you unlimited talk & text with 1GB of data. Perfect if you're mostly on Wi-Fi and want the lowest possible bill.", isBest: true },
    { type: "plan", id: "basic-30", reason: "For only $5 more at $30/mo, the Basic Plan gives you 5GB of data and a mobile hotspot. A little extra flexibility without breaking the bank.", isBest: false },
    { type: "plan", id: "value-40", reason: "The Value Plan at $40/mo is our most popular — 15GB of data, 5GB hotspot, and international texting. Best bang for your buck if you use data regularly.", isBest: false }
  ],
  'new-phone': [
    { type: "phone", id: "samsung-a25", reason: "The Galaxy A25 at $199 is the best all-rounder — 50MP camera with OIS, 6GB RAM, gorgeous Super AMOLED display, and 5000mAh battery. Hard to beat.", isBest: true },
    { type: "phone", id: "moto-g-power", reason: "If budget is a priority, the Moto G Power at $99 delivers solid performance, a massive battery, and 128GB storage. Best value phone we offer.", isBest: false },
    { type: "phone", id: "iphone-se", reason: "For Apple fans, the iPhone SE at $249 packs the powerful A15 Bionic chip, 5G capability, and the full iOS ecosystem in a compact design.", isBest: false }
  ],
  'not-working': [
    { type: "human", reason: "Based on what you've described, I think our support specialists can help troubleshoot this faster. They can check your account, run network diagnostics, and resolve most issues on the spot.", isBest: true },
    { type: "plan", id: "value-40", reason: "If your current plan is causing data or connectivity issues, the Value Plan at $40/mo offers 15GB of reliable 5G data — a solid upgrade that might fix things.", isBest: false },
    { type: "phone", id: "moto-g-power", reason: "If your phone itself is the problem, the Moto G Power at $99 is a dependable, budget-friendly replacement with great battery life and 5G support.", isBest: false }
  ]
};

// ─── Final recommendation messages per flow ───
const REC_MESSAGES = {
  'slow-data': "Alright, I've got a clear picture now. Based on your usage, here's what I'd recommend to fix your speed issues:",
  'runs-out': "OK, I can see why you're running out. Here are the best options to make sure you always have enough data:",
  'slow-phone': "Based on what you've told me, it sounds like a phone upgrade would make the biggest difference. Here are my top picks for you:",
  'storage': "Got it — you need more storage space. Here are the best phones that'll solve that problem:",
  'camera': "Great taste! Here are the best camera phones I'd recommend based on what you're looking for:",
  'cost': "I love finding ways to save. Here are the most affordable options that still cover what you need:",
  'new-phone': "Awesome — based on your preferences, here are the phones I'd recommend checking out:",
  'not-working': "I hear you — let's get this sorted. Here's what I think will help the most:"
};

function getFlowKey(firstMessage) {
  const msg = firstMessage.toLowerCase();

  if (msg.includes('slow') && (msg.includes('data') || msg.includes('internet') || msg.includes('speed'))) return 'slow-data';
  if (msg.includes('run out') || msg.includes('runs out') || (msg.includes('data') && msg.includes('end of'))) return 'runs-out';
  if (msg.includes('sluggish') || (msg.includes('slow') && msg.includes('phone'))) return 'slow-phone';
  if (msg.includes('storage') || msg.includes('space') || msg.includes('full')) return 'storage';
  if (msg.includes('photo') || msg.includes('picture') || msg.includes('camera')) return 'camera';
  if (msg.includes('cheap') || msg.includes('cost') || msg.includes('spend less') || msg.includes('save') || msg.includes('affordable')) return 'cost';
  if (msg.includes('new phone') || msg.includes('upgrade') || msg.includes('replace') || msg.includes('thinking about getting')) return 'new-phone';
  if (msg.includes('not working') || msg.includes('isn\'t working') || msg.includes('broken') || msg.includes('dropping') || msg.includes('can\'t connect')) return 'not-working';

  return 'cost'; // default fallback
}

export function generateDemoResponse(messages) {
  const userMessages = messages.filter(m => m.role === 'user');
  const turn = userMessages.length;
  const firstUserMsg = userMessages[0]?.content || '';
  const flowKey = getFlowKey(firstUserMsg);
  const flow = FLOWS[flowKey] || FLOWS['cost'];

  if (turn <= flow.length) {
    const step = flow[turn - 1];
    let response = step.text;
    if (step.productImages) {
      response += `\n[PRODUCT_IMAGES]${JSON.stringify(step.productImages)}[/PRODUCT_IMAGES]`;
    }
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
