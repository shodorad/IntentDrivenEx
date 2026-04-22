-- ClearPath AI - Intent Mapping Dimension Table
-- Stores intent classification patterns for conversational AI
-- Maps user phrases to intent categories with negation handling

CREATE OR REPLACE TABLE `data-practice-472314.telecom_demo.dim_intent_mapping` (
  -- Intent identification
  intent_key STRING PRIMARY KEY,  -- e.g., 'quick_refill', 'diagnose_usage'
  intent_type STRING,            -- 'primary' or 'granular'
  
  -- Phrase patterns for intent classification
  phrases ARRAY<STRING>,         -- Phrases that trigger this intent
  negations ARRAY<STRING>,       -- Phrases that block this intent
  
  -- Metadata
  description STRING,            -- Intent description
  category STRING,               -- Intent category grouping
  priority INT64,                -- Priority for conflict resolution
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

-- Add table description and labels
ALTER TABLE `data-practice-472314.telecom_demo.dim_intent_mapping` 
SET OPTIONS (
  description="ClearPath AI intent classification patterns and phrases"
);

-- Create clustered index on intent_type for query optimization
ALTER TABLE `data-practice-472314.telecom_demo.dim_intent_mapping`
SET OPTIONS (
  clustering_field = "intent_type"
);

-- Add comments for key columns
ALTER TABLE `data-practice-472314.telecom_demo.dim_intent_mapping`
ALTER COLUMN intent_key SET OPTIONS (description="Unique intent identifier used in application code");
ALTER TABLE `data-practice-472314.telecom_demo.dim_intent_mapping`
ALTER COLUMN intent_type SET OPTIONS (description="Primary intents for main flows, granular for specific sub-flows");
ALTER TABLE `data-practice-472314.telecom_demo.dim_intent_mapping`
ALTER COLUMN phrases SET OPTIONS (description="Array of phrases that trigger this intent classification");
ALTER TABLE `data-practice-472314.telecom_demo.dim_intent_mapping`
ALTER COLUMN negations SET OPTIONS (description="Array of phrases that block this intent when present");
