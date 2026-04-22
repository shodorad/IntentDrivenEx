#!/usr/bin/env python3
"""
ClearPath AI: Persona and Intent Mapping Data Loader
Loads personas and intent mapping data into BigQuery for dynamic integration
"""

import os
import json
import datetime
from pathlib import Path

from google.cloud import bigquery
import pandas as pd
import pyarrow as pa
from pyarrow import Table as pa_table

# Config
PROJECT_ID = "data-practice-472314"
DATASET_ID = "telecom_demo"

def init_client():
    """Initialize BigQuery client"""
    client = bigquery.Client(project=PROJECT_ID)
    return client

def generate_dim_persona():
    """Generate persona data from the existing personas.js structure"""
    
    personas = [
        {
            'persona_id': 'us-001',
            'name': 'Maria R.',
            'avatar': 'MR',
            'dropdown_label': 'Maria R. - Running low on data',
            'intent_category': 'refill',
            'urgency': 'critical',
            'plan': 'Total Base 5G',
            'plan_price': '$40/mo',
            'data_remaining': '0.8 GB',
            'data_total': '5 GB',
            'data_percent': 16,
            'hotspot_remaining': '0 GB',
            'hotspot_total': '0 GB',
            'renewal_date': datetime.date(2026, 4, 9),
            'days_until_renewal': 14,
            'auto_pay_enabled': False,
            'saved_card': 'Visa ****4291',
            'rewards_points': 340,
            'rewards_expiring': 120,
            'rewards_expiring_days': 14,
            'device': 'Samsung Galaxy A14',
            'device_storage': '128 GB',
            'device_storage_used': '112 GB',
            'avg_daily_data_usage_gb': 0.28,
            'wifi_usage_percent': 22,
            'usage_history': [
                {'month': 'Nov', 'used': 5.0},
                {'month': 'Dec', 'used': 4.8},
                {'month': 'Jan', 'used': 5.0},
                {'month': 'Feb', 'used': 4.9},
                {'month': 'Mar', 'used': 4.2},
            ],
            'provider_knows': [
                'current data balance (0.8 GB)',
                'plan renewal date (Apr 9, 2026)',
                'how often she runs out of data (11 of last 12 months)',
                'Wi-Fi usage percentage (22% - mostly cellular)',
                'daily average data usage (~0.28 GB/day)',
                'saved payment card on file (Visa ****4291)',
                'device model (Samsung Galaxy A14)',
            ],
            'signals': [
                {
                    'id': 'sig-001-a',
                    'severity': 'critical',
                    'icon': '??',
                    'headline': 'Only 0.8 GB left',
                    'subtext': 'Your plan renews Apr 9 - 14 days away.',
                },
                {
                    'id': 'sig-001-b',
                    'severity': 'warning',
                    'icon': '??',
                    'headline': 'You ran out of data 11 of the last 12 months',
                    'subtext': 'A plan change could stop this from happening again.',
                },
            ],
            'user_story': 'As a Total Wireless prepaid customer, I want to see my data balance, hotspot usage, and plan expiry the moment I open the app, so that I always know where I stand without navigating anywhere.',
            'suggested_actions': [
                {'label': 'Why am I running out?', 'label_es': 'Por qué se me acaban los datos', 'action': 'diagnose_usage'},
                {'label': 'Quick Refill - $15', 'label_es': 'Recarga Rápida - $15', 'action': 'quick_refill'},
                {'label': 'Add 5 GB of data - $10', 'label_es': 'Agregar 5 GB de datos - $10', 'action': 'add_data'},
                {'label': 'Change my plan', 'label_es': 'Cambiar mi plan', 'action': 'plan_change'},
            ],
            'diagnosis_flow_enabled': True,
            'diagnosis_intro': 'We can see you\'re mostly on cellular - only 22% of your usage goes through Wi-Fi. Let\'s see if there\'s a free fix first.',
            'conversation_context': 'Maria has 0.8 GB left and her plan doesn\'t renew for 14 days. She has hit her data cap 11 of the last 12 months. Her Wi-Fi usage is only 22% - she is likely burning data on cellular when she doesn\'t need to.'
        },
        {
            'persona_id': 'us-002',
            'name': 'Carlos M.',
            'avatar': 'CM',
            'dropdown_label': 'Carlos M. - Plan expires in 2 days',
            'intent_category': 'refill',
            'urgency': 'critical',
            'plan': 'Total Base 5G',
            'plan_price': '$40/mo',
            'data_remaining': '2.1 GB',
            'data_total': '5 GB',
            'data_percent': 42,
            'hotspot_remaining': '0 GB',
            'hotspot_total': '0 GB',
            'renewal_date': datetime.date(2026, 3, 30),
            'days_until_renewal': 2,
            'auto_pay_enabled': False,
            'saved_card': 'Mastercard ****8810',
            'rewards_points': 680,
            'rewards_expiring': 0,
            'rewards_expiring_days': 0,
            'device': 'Motorola Moto G 5G',
            'device_storage': '64 GB',
            'device_storage_used': '41 GB',
            'avg_daily_data_usage_gb': 0.25,
            'wifi_usage_percent': 35,
            'usage_history': [
                {'month': 'Nov', 'used': 4.5},
                {'month': 'Dec', 'used': 4.8},
                {'month': 'Jan', 'used': 4.2},
                {'month': 'Feb', 'used': 4.6},
                {'month': 'Mar', 'used': 4.3},
            ],
            'provider_knows': [
                'plan expiry date (Mar 30, 2026 - 2 days away)',
                'current data remaining (2.1 GB)',
                'last plan (Total Base 5G - pre-select for renewal)',
                'AutoPay has never been enabled (potential $5/mo savings)',
                'Rewards Points balance (680 - 320 away from free add-on)',
                'saved payment card (Mastercard ****8810)',
            ],
            'signals': [
                {
                    'id': 'sig-002-a',
                    'severity': 'critical',
                    'icon': '??',
                    'headline': 'Plan expires in 2 days',
                    'subtext': 'Service will pause on Mar 30 if not renewed.',
                },
                {
                    'id': 'sig-002-b',
                    'severity': 'info',
                    'icon': '??',
                    'headline': 'AutoPay saves you $5/mo',
                    'subtext': 'You\'ve never used AutoPay - enabling it saves $60/year.',
                },
            ],
            'user_story': 'As a Total Wireless prepaid customer with low data, I want to choose a refill plan or data add-on quickly, so that I can restore my service in 3 taps or fewer.',
            'suggested_actions': [
                {'label': 'Renew Total Base 5G - $40', 'label_es': 'Renovar Total Base 5G - $40', 'action': 'renew_current'},
                {'label': 'Upgrade to Unlimited', 'label_es': 'Cambiar a Ilimitado', 'action': 'upgrade_unlimited'},
                {'label': 'Enable AutoPay & save $5', 'label_es': 'Activar AutoPago y ahorrar $5', 'action': 'enable_autopay'},
            ],
            'diagnosis_flow_enabled': False,
            'diagnosis_intro': '',
            'conversation_context': 'Carlos\'s plan expires in 2 days. He has data remaining but service will cut off at expiry. This is time-sensitive - lead with urgency but don\'t panic him.'
        },
        # Add more personas as needed...
    ]
    
    return pd.DataFrame(personas)

def generate_dim_intent_mapping():
    """Generate intent mapping data from the existing intentmap.js structure"""
    
    intents = [
        {
            'intent_key': 'quick_refill',
            'intent_type': 'primary',
            'phrases': [
                'almost out', 'running low', 'low on data', 'need more data',
                'add data', 'buy data', 'quick refill', 'top up', 'top-up',
                'data add-on', 'ran out', 'just ran out', 'out of data right now',
                'refill', 'expir', 'renew my plan', 'autopay',
            ],
            'negations': ["don't need data", 'not running out', 'still have plenty'],
            'description': 'User wants to quickly refill data or renew plan',
            'category': 'refill',
            'priority': 1
        },
        {
            'intent_key': 'diagnose_usage',
            'intent_type': 'primary',
            'phrases': [
                'why am i', 'why do i', 'keep running out', 'using so much data',
                'why is my data', 'why does my data', 'how do i use less',
                'where is my data', 'what is using my data', 'data keeps draining',
                'diagnose why', 'diagnose the', 'figure out why', 'find out why',
                "what's using my", 'why it keeps', 'why i keep', 'why does it',
                'check my usage', 'check usage', 'analyze my data', 'investigate',
            ],
            'negations': [],
            'description': 'User wants to understand why they are using so much data',
            'category': 'support',
            'priority': 2
        },
        {
            'intent_key': 'plan_change',
            'intent_type': 'primary',
            'phrases': [
                'change my plan', 'switch my plan', 'different plan', 'cheaper plan',
                'lower my plan', 'downgrade', 'change plan', 'smaller plan',
                'switch to a cheaper', 'want a different plan',
            ],
            'negations': ["don't want to switch", 'stay on my plan', 'keep my plan'],
            'description': 'User wants to change their current plan',
            'category': 'upgrade',
            'priority': 3
        },
        {
            'intent_key': 'upgrade_now',
            'intent_type': 'primary',
            'phrases': [
                'upgrade', 'unlimited plan', 'get unlimited', 'need unlimited',
                'better plan', 'bigger plan', 'more data plan', '55/mo',
                'upgrade my plan', 'want unlimited', 'switch to unlimited',
            ],
            'negations': [
                "don't want to upgrade", "don't need unlimited", 'no upgrade',
                'not looking to upgrade', 'not upgrading', "don't upgrade",
                "don't want unlimited",
            ],
            'description': 'User wants to upgrade to a better plan',
            'category': 'upgrade',
            'priority': 4
        },
        {
            'intent_key': 'browse_phones',
            'intent_type': 'primary',
            'phrases': [
                'new phone', 'replace my phone', 'buy a phone', 'get a new phone',
                'phone upgrade', 'looking for a phone', 'show me phones',
                'browse phones', 'phone options', 'what phones do you have',
                'thinking about getting a phone',
            ],
            'negations': ['keep my phone', 'not getting a phone', 'no new phone'],
            'description': 'User wants to browse phone options',
            'category': 'phone',
            'priority': 5
        },
        {
            'intent_key': 'support',
            'intent_type': 'primary',
            'phrases': [
                'dropped calls', 'dropping calls', 'calls keep dropping',
                'no signal', 'bad signal', 'poor signal', 'weak signal',
                'outage', 'network issue', 'connectivity issue',
                'signal issue', 'losing signal', 'keeps dropping', 'dead zone',
                'bars of signal', 'phone keeps cutting out',
            ],
            'negations': [],
            'description': 'User is experiencing technical issues',
            'category': 'support',
            'priority': 6
        },
        # Add more intents as needed...
    ]
    
    return pd.DataFrame(intents)

def load_dim_persona(client):
    """Load persona dimension table"""
    print("Loading dim_persona...")
    
    df = generate_dim_persona()
    
    # Convert complex fields to JSON strings for BigQuery compatibility
    df['usage_history'] = df['usage_history'].apply(json.dumps)
    df['provider_knows'] = df['provider_knows'].apply(json.dumps)
    df['signals'] = df['signals'].apply(json.dumps)
    df['suggested_actions'] = df['suggested_actions'].apply(json.dumps)
    
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        autodetect=True
    )
    
    job = client.load_table_from_dataframe(
        df,
        f"{PROJECT_ID}.{DATASET_ID}.dim_persona",
        job_config=job_config
    )
    job.result()
    print(f"Loaded {len(df)} personas to dim_persona")

def load_dim_intent_mapping(client):
    """Load intent mapping dimension table"""
    print("Loading dim_intent_mapping...")
    
    df = generate_dim_intent_mapping()
    
    # Convert array fields to JSON strings for BigQuery compatibility
    df['phrases'] = df['phrases'].apply(json.dumps)
    df['negations'] = df['negations'].apply(json.dumps)
    
    job_config = bigquery.LoadJobConfig(
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
        autodetect=True
    )
    
    job = client.load_table_from_dataframe(
        df,
        f"{PROJECT_ID}.{DATASET_ID}.dim_intent_mapping",
        job_config=job_config
    )
    job.result()
    print(f"Loaded {len(df)} intent mappings to dim_intent_mapping")

def main():
    """Main execution function"""
    print("Starting Persona and Intent Mapping Data Loader...")
    
    # Initialize BigQuery client
    client = init_client()
    
    # Generate and load all data
    print("\n=== Generating and Loading Data ===")
    
    # Load persona and intent mapping tables
    load_dim_persona(client)
    load_dim_intent_mapping(client)
    
    print("\n=== Data Loading Complete ===")
    print(f"Dataset: {PROJECT_ID}.{DATASET_ID}")
    print("Personas and intent mapping loaded successfully!")

if __name__ == "__main__":
    main()
