#!/usr/bin/env python3
"""
Update BigQuery persona schema to match static data structure
"""

import os
from google.cloud import bigquery

def update_persona_schema():
    """Add missing fields to dim_persona table"""
    client = bigquery.Client(project='data-practice-472314')
    
    print("Adding missing columns to dim_persona table...")
    
    # Add missing columns
    alter_sql = """
    ALTER TABLE `data-practice-472314.telecom_demo.dim_persona`
    ADD COLUMN IF NOT EXISTS diagnosis_flow_steps JSON,
    ADD COLUMN IF NOT EXISTS data_cap_hits_last_12_months INT64
    """
    
    try:
        job = client.query(alter_sql)
        job.result()
        print("Columns added successfully!")
    except Exception as e:
        print(f"Error adding columns: {e}")
        return False
    
    print("Updating existing persona data...")
    
    # Update data for each persona
    persona_updates = {
        'us-001': 11,
        'us-002': 2, 
        'us-003': 5,
        'us-004': 0,
        'us-005': 3,
        'us-006': 12,
        'us-007': 1,
        'us-008': 0,
        'us-009': 0,
        'us-010': 0
    }
    
    # Standard diagnosis steps for all personas
    diagnosis_steps = [
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
    ]
    
    import json
    diagnosis_json = json.dumps(diagnosis_steps)
    
    for persona_id, cap_hits in persona_updates.items():
        update_sql = f"""
        UPDATE `data-practice-472314.telecom_demo.dim_persona`
        SET 
            diagnosis_flow_steps = '{diagnosis_json}',
            data_cap_hits_last_12_months = {cap_hits}
        WHERE persona_id = '{persona_id}'
        """
        
        try:
            job = client.query(update_sql)
            job.result()
            print(f"Updated {persona_id}")
        except Exception as e:
            print(f"Error updating {persona_id}: {e}")
    
    print("BigQuery schema update complete!")
    return True

if __name__ == "__main__":
    update_persona_schema()
