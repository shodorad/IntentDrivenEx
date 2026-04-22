#!/usr/bin/env python3
"""
Fix persona data with proper JSON formatting
"""

import os
import json
from google.cloud import bigquery

def fix_persona_data():
    """Update persona data with proper JSON formatting"""
    client = bigquery.Client(project='data-practice-472314')
    
    print("Fixing persona data with proper JSON formatting...")
    
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
    
    # Convert to JSON string and escape properly
    diagnosis_json = json.dumps(diagnosis_steps)
    
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
    
    for persona_id, cap_hits in persona_updates.items():
        # Use parameterized query to avoid JSON escaping issues
        query = f"""
        UPDATE `data-practice-472314.telecom_demo.dim_persona`
        SET 
            diagnosis_flow_steps = @diagnosis_steps,
            data_cap_hits_last_12_months = @cap_hits
        WHERE persona_id = @persona_id
        """
        
        job_config = bigquery.QueryJobConfig(
            query=query,
            query_parameters=[
                bigquery.ScalarQueryParameter("diagnosis_steps", "JSON", diagnosis_json),
                bigquery.ScalarQueryParameter("cap_hits", "INT64", cap_hits),
                bigquery.ScalarQueryParameter("persona_id", "STRING", persona_id)
            ]
        )
        
        try:
            job = client.query(job_config)
            job.result()
            print(f"Updated {persona_id} successfully")
        except Exception as e:
            print(f"Error updating {persona_id}: {e}")
    
    print("Persona data fix complete!")
    
    # Verify the updates
    print("Verifying updates...")
    verify_query = """
    SELECT persona_id, data_cap_hits_last_12_months, 
           ARRAY_LENGTH(diagnosis_flow_steps) as steps_count
    FROM `data-practice-472314.telecom_demo.dim_persona`
    ORDER BY persona_id
    """
    
    try:
        job = client.query(verify_query)
        results = job.result()
        
        print("Verification results:")
        for row in results:
            print(f"  {row.persona_id}: cap_hits={row.data_cap_hits_last_12_months}, steps={row.steps_count}")
            
    except Exception as e:
        print(f"Verification error: {e}")

if __name__ == "__main__":
    fix_persona_data()
