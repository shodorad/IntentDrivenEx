// BigQuery API Service for ClearPath AI
// Handles fetching product data from BigQuery tables

const PROJECT_ID = "data-practice-472314";
const DATASET_ID = "telecom_demo";

// Helper function to call our API proxy for BigQuery queries
async function queryBigQuery(sql) {
  try {
    const response = await fetch('/api/bigquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      throw new Error(`BigQuery API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('BigQuery query failed:', error);
    throw error;
  }
}

// Fetch all plans from BigQuery
export async function fetchPlans() {
  const sql = `
    SELECT * FROM \`${PROJECT_ID}.${DATASET_ID}.dim_plan\`
    ORDER BY price ASC
  `;
  
  const result = await queryBigQuery(sql);
  return result.map(row => ({
    id: row.id,
    name: row.name,
    price: parseFloat(row.price),
    priceNote: row.priceNote,
    data: row.data,
    hotspot: row.hotspot,
    talk: row.talk,
    text: row.text,
    network: row.network,
    international: row.international,
    videoStreaming: row.videoStreaming,
    features: row.features || [],
    highlight: row.highlight,
    solveLabel: row.solveLabel,
    solves: row.solves || [],
    badge: row.badge,
    dealNote: row.dealNote,
    url: row.url,
    tier: row.tier,
    data_limit_gb: row.data_limit_gb,
    hotspot_limit_gb: row.hotspot_limit_gb,
    international_countries: row.international_countries
  }));
}

// Fetch all devices from BigQuery
export async function fetchDevices() {
  const sql = `
    SELECT * FROM \`${PROJECT_ID}.${DATASET_ID}.dim_device\`
    ORDER BY price ASC NULLS LAST
  `;
  
  const result = await queryBigQuery(sql);
  return result.map(row => ({
    id: row.id,
    name: row.name,
    brand: row.brand,
    price: row.price ? parseFloat(row.price) : null,
    priceNote: row.priceNote,
    camera: row.camera,
    storage: row.storage,
    ram: row.ram,
    battery: row.battery,
    display: row.display,
    features: row.features || [],
    highlight: row.highlight,
    solveLabel: row.solveLabel,
    solves: row.solves || [],
    badge: row.badge,
    image: row.image,
    url: row.url,
    dealExpiry: row.dealExpiry,
    dealLimit: row.dealLimit,
    device_id: row.device_id,
    model: row.model,
    storage_gb: row.storage_gb,
    ram_gb: row.ram_gb,
    os: row.os
  }));
}

// Fetch subscriber data for personalization
export async function fetchSubscriber(subscriberId) {
  const sql = `
    SELECT 
      s.*,
      p.name as plan_name,
      p.price as plan_price,
      d.name as device_name,
      d.brand as device_brand
    FROM \`${PROJECT_ID}.${DATASET_ID}.dim_subscriber\` s
    LEFT JOIN \`${PROJECT_ID}.${DATASET_ID}.dim_plan\` p ON s.plan_id = p.id
    LEFT JOIN \`${PROJECT_ID}.${DATASET_ID}.dim_device\` d ON s.device_id = d.id
    WHERE s.subscriber_id = '${subscriberId}'
  `;
  
  const result = await queryBigQuery(sql);
  return result[0] || null;
}

// Fetch usage data for a subscriber
export async function fetchUsageData(subscriberId, days = 30) {
  const sql = `
    SELECT 
      date,
      data_gb_used,
      hotspot_gb_used,
      throttle_flag,
      refill_flag
    FROM \`${PROJECT_ID}.${DATASET_ID}.fact_usage_daily\`
    WHERE subscriber_id = '${subscriberId}'
      AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${days} DAY)
    ORDER BY date DESC
  `;
  
  const result = await queryBigQuery(sql);
  return result;
}

// Fetch network events for a subscriber
export async function fetchNetworkEvents(subscriberId, days = 30) {
  const sql = `
    SELECT 
      event_timestamp,
      event_type,
      severity,
      cell_site_id
    FROM \`${PROJECT_ID}.${DATASET_ID}.fact_network_events\`
    WHERE subscriber_id = '${subscriberId}'
      AND event_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${days} DAY)
    ORDER BY event_timestamp DESC
  `;
  
  const result = await queryBigQuery(sql);
  return result;
}

// Fetch personas data from BigQuery
export async function fetchPersonas() {
  const sql = `
    SELECT 
      persona_id,
      name,
      avatar,
      dropdown_label,
      intent_category,
      urgency,
      plan,
      plan_price,
      data_remaining,
      data_total,
      data_percent,
      hotspot_remaining,
      hotspot_total,
      renewal_date,
      days_until_renewal,
      auto_pay_enabled,
      saved_card,
      rewards_points,
      rewards_expiring,
      rewards_expiring_days,
      device,
      device_storage,
      device_storage_used,
      avg_daily_data_usage_gb,
      wifi_usage_percent,
      usage_history,
      provider_knows,
      signals,
      user_story,
      suggested_actions,
      diagnosis_flow_enabled,
      diagnosis_intro,
      diagnosis_flow_steps,
      data_cap_hits_last_12_months,
      conversation_context
    FROM \`${PROJECT_ID}.${DATASET_ID}.dim_persona\`
    ORDER BY urgency DESC, name ASC
  `;
  
  const result = await queryBigQuery(sql);
  return result.map(row => {
    // Parse JSON fields that come back as strings from BigQuery
    let usageHistory = [];
    let providerKnows = [];
    let signals = [];
    let suggestedActions = [];
    let diagnosisFlowSteps = [];
    
    try {
      usageHistory = row.usage_history ? JSON.parse(row.usage_history) : [];
    } catch (e) {
      console.warn('Failed to parse usage_history:', e);
    }
    
    try {
      providerKnows = row.provider_knows ? JSON.parse(row.provider_knows) : [];
    } catch (e) {
      console.warn('Failed to parse provider_knows:', e);
    }
    
    try {
      signals = row.signals ? JSON.parse(row.signals) : [];
    } catch (e) {
      console.warn('Failed to parse signals:', e);
    }
    
    try {
      suggestedActions = row.suggested_actions ? JSON.parse(row.suggested_actions) : [];
    } catch (e) {
      console.warn('Failed to parse suggested_actions:', e);
    }
    
    try {
      diagnosisFlowSteps = row.diagnosis_flow_steps ? JSON.parse(row.diagnosis_flow_steps) : [];
    } catch (e) {
      console.warn('Failed to parse diagnosis_flow_steps:', e);
    }
    
    return {
      id: row.persona_id,
      name: row.name,
      avatar: row.avatar,
      dropdownLabel: row.dropdown_label,
      intentCategory: row.intent_category,
      urgency: row.urgency,
      account: {
        plan: row.plan,
        planPrice: row.plan_price,
        dataRemaining: row.data_remaining,
        dataTotal: row.data_total,
        dataPercent: row.data_percent,
        hotspotRemaining: row.hotspot_remaining,
        hotspotTotal: row.hotspot_total,
        renewalDate: row.renewal_date,
        daysUntilRenewal: row.days_until_renewal,
        autoPayEnabled: row.auto_pay_enabled,
        savedCard: row.saved_card,
        rewardsPoints: row.rewards_points,
        rewardsExpiring: row.rewards_expiring,
        rewardsExpiringDays: row.rewards_expiring_days,
        device: row.device,
        deviceStorage: row.device_storage,
        deviceStorageUsed: row.device_storage_used,
        avgDailyDataUsageGB: row.avg_daily_data_usage_gb,
        wifiUsagePercent: row.wifi_usage_percent,
        usageHistory: usageHistory,
        dataCapHitsLast12Months: row.data_cap_hits_last_12_months || 0
      },
      providerKnows: providerKnows,
      signals: signals,
      userStory: row.user_story,
      suggestedActions: suggestedActions,
      diagnosisFlow: {
        enabled: row.diagnosis_flow_enabled,
        intro: row.diagnosis_intro,
        steps: diagnosisFlowSteps.length > 0 ? diagnosisFlowSteps : [
          {
            id: "diag-001-1",
            question: "Are you connected to Wi-Fi when you're at home or work?",
            hint: "Based on your usage, it looks like you may be on cellular even when Wi-Fi is available.",
            quickReplies: ["Yes, always", "Sometimes", "I'm not sure"]
          },
          {
            id: "diag-001-2", 
            question: "Do you stream video or music on cellular?",
            hint: "Video streaming on cellular can use 1-3 GB per hour.",
            quickReplies: ["Yes, often", "Occasionally", "Rarely"]
          },
          {
            id: "diag-001-3",
            question: "Do you have apps set to auto-update or sync in the background?",
            hint: "Background app refresh is one of the most common hidden data drains.",
            quickReplies: ["Probably yes", "I've disabled it", "Not sure"]
          }
        ]
      },
      conversationContext: row.conversation_context
    };
  });
}

// Fetch intent mapping data from BigQuery
export async function fetchIntentMap() {
  const sql = `
    SELECT 
      intent_key,
      phrases,
      negations,
      intent_type
    FROM \`${PROJECT_ID}.${DATASET_ID}.dim_intent_mapping\`
    ORDER BY intent_key ASC
  `;
  
  const result = await queryBigQuery(sql);
  const intentMap = {};
  
  result.forEach(row => {
    // Parse JSON fields that come back as strings from BigQuery
    let phrases = [];
    let negations = [];
    
    try {
      phrases = row.phrases ? JSON.parse(row.phrases) : [];
    } catch (e) {
      console.warn('Failed to parse phrases for intent', row.intent_key, ':', e);
    }
    
    try {
      negations = row.negations ? JSON.parse(row.negations) : [];
    } catch (e) {
      console.warn('Failed to parse negations for intent', row.intent_key, ':', e);
    }
    
    intentMap[row.intent_key] = {
      phrases: phrases,
      negations: negations,
      intentType: row.intent_type
    };
  });
  
  return intentMap;
}

// Fetch persona-specific intent signals
export async function fetchPersonaSignals(personaId) {
  const sql = `
    SELECT 
      signal_id,
      severity,
      icon,
      headline,
      subtext
    FROM \`${PROJECT_ID}.${DATASET_ID}.dim_persona_signals\`
    WHERE persona_id = '${personaId}'
    ORDER BY 
      CASE severity 
        WHEN 'critical' THEN 1 
        WHEN 'warning' THEN 2 
        WHEN 'info' THEN 3 
        ELSE 4 
      END
  `;
  
  const result = await queryBigQuery(sql);
  return result.map(row => ({
    id: row.signal_id,
    severity: row.severity,
    icon: row.icon,
    headline: row.headline,
    subtext: row.subtext
  }));
}

// Fetch conversation flow steps for persona
export async function fetchPersonaDiagnosisFlow(personaId) {
  const sql = `
    SELECT 
      step_id,
      step_type,
      question,
      hint,
      quick_replies,
      action,
      resolution,
      free_fix_suggestions,
      escalation_prompt
    FROM \`${PROJECT_ID}.${DATASET_ID}.dim_diagnosis_flow\`
    WHERE persona_id = '${personaId}'
    ORDER BY step_order ASC
  `;
  
  const result = await queryBigQuery(sql);
  return result.map(row => ({
    id: row.step_id,
    ...(row.step_type === 'question' && {
      question: row.question,
      hint: row.hint,
      quickReplies: row.quick_replies || []
    }),
    ...(row.step_type === 'action' && {
      action: row.action,
      label: row.question,
      resolution: row.resolution
    }),
    freeFixSuggestions: row.free_fix_suggestions || [],
    escalationPrompt: row.escalation_prompt
  }));
}
