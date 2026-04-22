-- ClearPath AI - Persona Signals Dimension Table
-- Stores alert signals for each persona
-- Separated from main persona table for better normalization

CREATE OR REPLACE TABLE `data-practice-472314.telecom_demo.dim_persona_signals` (
  -- Signal identification
  signal_id STRING PRIMARY KEY,   -- e.g., 'sig-001-a', 'sig-002-b'
  persona_id STRING,             -- Foreign key to dim_persona.persona_id
  severity STRING,               -- 'critical', 'warning', 'info'
  icon STRING,                   -- Emoji icon for the signal
  headline STRING,               -- Signal headline text
  subtext STRING,                -- Signal subtext/description
  
  -- Metadata
  signal_type STRING,            -- Type of signal (usage, renewal, device, etc.)
  priority INT64,                -- Display priority
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

-- Add table description and labels
ALTER TABLE `data-practice-472314.telecom_demo.dim_persona_signals` 
SET OPTIONS (
  description="ClearPath AI persona alert signals with severity and display information"
);

-- Create clustered index on persona_id and severity for query optimization
ALTER TABLE `data-practice-472314.telecom_demo.dim_persona_signals`
SET OPTIONS (
  clustering_field = "persona_id"
);

-- Add foreign key relationship (conceptual - BigQuery doesn't enforce FKs)
ALTER TABLE `data-practice-472314.telecom_demo.dim_persona_signals`
ALTER COLUMN persona_id SET OPTIONS (description="Foreign key reference to dim_persona.persona_id");
ALTER TABLE `data-practice-472314.telecom_demo.dim_persona_signals`
ALTER COLUMN severity SET OPTIONS (description="Signal severity: critical, warning, or info");
ALTER TABLE `data-practice-472314.telecom_demo.dim_persona_signals`
ALTER COLUMN icon SET OPTIONS (description="Emoji icon displayed with the signal");
