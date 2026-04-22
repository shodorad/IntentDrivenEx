#!/usr/bin/env python3
"""
Simple update for persona data to match static structure
"""

import os
import json
from google.cloud import bigquery

def update_persona_data():
    """Update persona data to match static structure"""
    client = bigquery.Client(project='data-practice-472314')
    
    print("Updating persona data to match static structure...")
    
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
    
    # Convert to JSON string
    diagnosis_json = json.dumps(diagnosis_steps)
    
    # Update data for each persona using simple queries
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
        try:
            # Use simple string replacement for JSON
            escaped_json = diagnosis_json.replace("'", "\\'")
            
            query = f"""
            UPDATE `data-practice-472314.telecom_demo.dim_persona`
            SET 
                diagnosis_flow_steps = '''{escaped_json}''',
                data_cap_hits_last_12_months = {cap_hits}
            WHERE persona_id = '{persona_id}'
            """
            
            job = client.query(query)
            job.result()
            print(f"Updated {persona_id} successfully")
            
        except Exception as e:
            print(f"Error updating {persona_id}: {e}")
            # Try a simpler update without JSON first
            try:
                simple_query = f"""
                UPDATE `data-practice-472314.telecom_demo.dim_persona`
                SET data_cap_hits_last_12_months = {cap_hits}
                WHERE persona_id = '{persona_id}'
                """
                job = client.query(simple_query)
                job.result()
                print(f"Updated {persona_id} (basic fields only)")
            except Exception as e2:
                print(f"Failed basic update for {persona_id}: {e2}")
    
    print("Persona data update complete!")
    
    # Verify the updates
    print("Verification:")
    try:
        results = client.query("""
            SELECT persona_id, data_cap_hits_last_12_months 
            FROM `data-practice-472314.telecom_demo.dim_persona`
            ORDER BY persona_id
        """)
        
        for row in results:
            print(f"  {row.persona_id}: cap_hits={row.data_cap_hits_last_12_months}")
            
    except Exception as e:
        print(f"Verification error: {e}")

if __name__ == "__main__":
    update_persona_data()
