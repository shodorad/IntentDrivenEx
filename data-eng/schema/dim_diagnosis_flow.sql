-- ClearPath AI - Diagnosis Flow Dimension Table
-- Stores conversational diagnosis flow steps for each persona
-- Supports multi-step troubleshooting and guidance flows

CREATE OR REPLACE TABLE `data-practice-472314.telecom_demo.dim_diagnosis_flow` (
  -- Flow step identification
  step_id STRING PRIMARY KEY,       -- e.g., 'diag-001-1', 'diag-005-2'
  persona_id STRING,               -- Foreign key to dim_persona.persona_id
  step_order INT64,                -- Order in the flow sequence
  
  -- Step content
  step_type STRING,                -- 'question', 'action', 'outage_check'
  question STRING,                 -- Question text (for question steps)
  hint STRING,                     -- Hint/guidance text
  quick_replies ARRAY<STRING>,     -- Quick reply options
  action STRING,                   -- Action description (for action steps)
  resolution STRING,               -- Resolution text (for action steps)
  
  -- Guidance and escalation
  free_fix_suggestions ARRAY<STRING>, -- Free fix suggestions
  escalation_prompt STRING,       -- When to escalate to paid options
  
  -- Metadata
  flow_category STRING,            -- Type of diagnosis flow
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

-- Add table description and labels
ALTER TABLE `data-practice-472314.telecom_demo.dim_diagnosis_flow` 
SET OPTIONS (
  description="ClearPath AI conversational diagnosis flow steps for persona troubleshooting"
);

-- Create clustered index on persona_id and step_order for query optimization
ALTER TABLE `data-practice-472314.telecom_demo.dim_diagnosis_flow`
SET OPTIONS (
  clustering_field = "persona_id"
);

-- Add column descriptions
ALTER TABLE `data-practice-472314.telecom_demo.dim_diagnosis_flow`
ALTER COLUMN persona_id SET OPTIONS (description="Foreign key reference to dim_persona.persona_id");
ALTER TABLE `data-practice-472314.telecom_demo.dim_diagnosis_flow`
ALTER COLUMN step_type SET OPTIONS (description="Type of step: question, action, or outage_check");
ALTER TABLE `data-practice-472314.telecom_demo.dim_diagnosis_flow`
ALTER COLUMN step_order SET OPTIONS (description="Sequential order of this step in the diagnosis flow");
ALTER TABLE `data-practice-472314.telecom_demo.dim_diagnosis_flow`
ALTER COLUMN question SET OPTIONS (description="Question text for user interaction");
ALTER TABLE `data-practice-472314.telecom_demo.dim_diagnosis_flow`
ALTER COLUMN quick_replies SET OPTIONS (description="Array of quick reply options for the user");
