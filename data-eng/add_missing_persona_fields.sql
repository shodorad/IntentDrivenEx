-- Add missing fields to dim_persona table to match static data structure
-- Run this in BigQuery console to update the table schema

ALTER TABLE `data-practice-472314.telecom_demo.dim_persona`
ADD COLUMN IF NOT EXISTS diagnosis_flow_steps JSON,
ADD COLUMN IF NOT EXISTS data_cap_hits_last_12_months INT64;

-- Update existing personas with missing data
UPDATE `data-practice-472314.telecom_demo.dim_persona`
SET 
  diagnosis_flow_steps = JSON.stringify([
    {
      "id": "diag-001-1",
      "question": "Are you connected to Wi-Fi when you're at home or work?",
      "hint": "Based on your usage, it looks like you may be on cellular even when Wi-Fi is available.",
      "quickReplies": ["Yes, always", "Sometimes", "I'm not sure"]
    },
    {
      "id": "diag-001-2", 
      "question": "Do you stream video or music on cellular?",
      "hint": "Video streaming on cellular can use 1-3 GB per hour.",
      "quickReplies": ["Yes, often", "Occasionally", "Rarely"]
    },
    {
      "id": "diag-001-3",
      "question": "Do you have apps set to auto-update or sync in the background?",
      "hint": "Background app refresh is one of the most common hidden data drains.",
      "quickReplies": ["Probably yes", "I've disabled it", "Not sure"]
    }
  ]),
  data_cap_hits_last_12_months = CASE 
    WHEN persona_id = 'us-001' THEN 11
    WHEN persona_id = 'us-002' THEN 2
    WHEN persona_id = 'us-003' THEN 5
    WHEN persona_id = 'us-004' THEN 0
    WHEN persona_id = 'us-005' THEN 3
    WHEN persona_id = 'us-006' THEN 12
    WHEN persona_id = 'us-007' THEN 1
    WHEN persona_id = 'us-008' THEN 0
    WHEN persona_id = 'us-009' THEN 0
    WHEN persona_id = 'us-010' THEN 0
    ELSE 0
  END
WHERE persona_id IN ('us-001', 'us-002', 'us-003', 'us-004', 'us-005', 'us-006', 'us-007', 'us-008', 'us-009', 'us-010');
