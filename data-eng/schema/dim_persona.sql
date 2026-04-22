-- ClearPath AI - Persona Dimension Table
-- Stores user persona data for conversational AI system
-- Each persona represents a user story with specific characteristics and behaviors

CREATE OR REPLACE TABLE `data-practice-472314.telecom_demo.dim_persona` (
  -- Primary persona identification
  persona_id STRING PRIMARY KEY,  -- e.g., 'us-001', 'us-002'
  name STRING,                   -- e.g., 'Maria R.', 'Carlos M.'
  avatar STRING,                 -- e.g., 'MR', 'CM'
  dropdown_label STRING,         -- e.g., 'Maria R. - Running low on data'
  intent_category STRING,        -- 'refill', 'activate', 'support', 'upgrade', 'addon'
  urgency STRING,                -- 'critical', 'high', 'medium', 'upsell'
  
  -- Account information
  plan STRING,                   -- Current plan name
  plan_price STRING,             -- Plan price with formatting
  data_remaining STRING,         -- Current data balance
  data_total STRING,             -- Total data allowance
  data_percent INT64,            -- Data usage percentage
  hotspot_remaining STRING,      -- Hotspot data remaining
  hotspot_total STRING,          -- Total hotspot data
  renewal_date DATE,             -- Plan renewal date
  days_until_renewal INT64,      -- Days until renewal
  auto_pay_enabled BOOLEAN,      -- AutoPay status
  saved_card STRING,             -- Saved payment method
  rewards_points INT64,          -- Current rewards points
  rewards_expiring INT64,        -- Points expiring soon
  rewards_expiring_days INT64,    -- Days until points expire
  device STRING,                  -- Device model
  device_storage STRING,         -- Device storage capacity
  device_storage_used STRING,    -- Used storage
  avg_daily_data_usage_gb FLOAT64, -- Average daily data usage
  wifi_usage_percent INT64,      -- Wi-Fi usage percentage
  
  -- JSON fields for complex data
  usage_history ARRAY<STRUCT<month STRING, used FLOAT64>>,  -- Monthly usage history
  provider_knows ARRAY<STRING>,  -- What provider already knows
  signals ARRAY<STRUCT<id STRING, severity STRING, icon STRING, headline STRING, subtext STRING>>,  -- Alert signals
  user_story STRING,             -- User story description
  suggested_actions ARRAY<STRUCT<label STRING, label_es STRING, action STRING>>,  -- Action buttons
  diagnosis_flow_enabled BOOLEAN, -- Whether diagnosis flow is enabled
  diagnosis_intro STRING,         -- Diagnosis introduction text
  conversation_context STRING    -- AI conversation rules and context
);

-- Add table description and labels
ALTER TABLE `data-practice-472314.telecom_demo.dim_persona` 
SET OPTIONS (
  description="ClearPath AI user personas with account data, signals, and conversation flows"
);

-- Add partitioning by urgency for query optimization
ALTER TABLE `data-practice-472314.telecom_demo.dim_persona`
SET OPTIONS (
  partitioning_type = "RANGE",
  partitioning_field = "urgency"
);

-- Create clustered index on intent_category for common queries
ALTER TABLE `data-practice-472314.telecom_demo.dim_persona`
SET OPTIONS (
  clustering_field = "intent_category"
);
