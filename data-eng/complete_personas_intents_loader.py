#!/usr/bin/env python3
"""
Complete Personas and Intent Mapping Data Loader
Loads ALL personas and intents from the original JavaScript files into BigQuery
"""

import os
import json
import datetime
from pathlib import Path

from google.cloud import bigquery
import pandas as pd

# Config
PROJECT_ID = "data-practice-472314"
DATASET_ID = "telecom_demo"

def init_client():
    """Initialize BigQuery client"""
    client = bigquery.Client(project=PROJECT_ID)
    return client

def generate_complete_personas():
    """Generate ALL personas from the original personas.js file"""
    
    personas = [
        # us-001 - Maria R.
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
            'usage_history': json.dumps([
                {'month': 'Nov', 'used': 5.0},
                {'month': 'Dec', 'used': 4.8},
                {'month': 'Jan', 'used': 5.0},
                {'month': 'Feb', 'used': 4.9},
                {'month': 'Mar', 'used': 4.2},
            ]),
            'provider_knows': json.dumps([
                'current data balance (0.8 GB)',
                'plan renewal date (Apr 9, 2026)',
                'how often she runs out of data (11 of last 12 months)',
                'Wi-Fi usage percentage (22% - mostly cellular)',
                'daily average data usage (~0.28 GB/day)',
                'saved payment card on file (Visa ****4291)',
                'device model (Samsung Galaxy A14)',
            ]),
            'signals': json.dumps([
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
                {
                    'id': 'sig-001-c',
                    'severity': 'info',
                    'icon': '??',
                    'headline': 'App opened 3 times today with no action',
                    'subtext': 'Looks like you\'ve been checking your balance. We\'re here when you\'re ready.',
                },
            ]),
            'user_story': 'As a Total Wireless prepaid customer, I want to see my data balance, hotspot usage, and plan expiry the moment I open the app, so that I always know where I stand without navigating anywhere.',
            'suggested_actions': json.dumps([
                {'label': 'Why am I running out?', 'label_es': 'Por qué se me acaban los datos', 'action': 'diagnose_usage'},
                {'label': 'Quick Refill - $15', 'label_es': 'Recarga Rápida - $15', 'action': 'quick_refill'},
                {'label': 'Add 5 GB of data - $10', 'label_es': 'Agregar 5 GB de datos - $10', 'action': 'add_data'},
                {'label': 'Change my plan', 'label_es': 'Cambiar mi plan', 'action': 'plan_change'},
            ]),
            'diagnosis_flow_enabled': True,
            'diagnosis_intro': 'We can see you\'re mostly on cellular - only 22% of your usage goes through Wi-Fi. Let\'s see if there\'s a free fix first.',
            'conversation_context': 'Maria has 0.8 GB left and her plan doesn\'t renew for 14 days. She has hit her data cap 11 of the last 12 months. Her Wi-Fi usage is only 22% - she is likely burning data on cellular when she doesn\'t need to.'
        },
        
        # us-002 - Carlos M.
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
            'usage_history': json.dumps([
                {'month': 'Nov', 'used': 4.5},
                {'month': 'Dec', 'used': 4.8},
                {'month': 'Jan', 'used': 4.2},
                {'month': 'Feb', 'used': 4.6},
                {'month': 'Mar', 'used': 4.3},
            ]),
            'provider_knows': json.dumps([
                'plan expiry date (Mar 30, 2026 - 2 days away)',
                'current data remaining (2.1 GB)',
                'last plan (Total Base 5G - pre-select for renewal)',
                'AutoPay has never been enabled (potential $5/mo savings)',
                'Rewards Points balance (680 - 320 away from free add-on)',
                'saved payment card (Mastercard ****8810)',
            ]),
            'signals': json.dumps([
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
                {
                    'id': 'sig-002-c',
                    'severity': 'info',
                    'icon': '??',
                    'headline': '680 Rewards Points ready',
                    'subtext': 'You\'re 320 points away from a free add-on.',
                },
            ]),
            'user_story': 'As a Total Wireless prepaid customer with low data, I want to choose a refill plan or data add-on quickly, so that I can restore my service in 3 taps or fewer.',
            'suggested_actions': json.dumps([
                {'label': 'Renew Total Base 5G - $40', 'label_es': 'Renovar Total Base 5G - $40', 'action': 'renew_current'},
                {'label': 'Upgrade to Unlimited', 'label_es': 'Cambiar a Ilimitado', 'action': 'upgrade_unlimited'},
                {'label': 'Enable AutoPay & save $5', 'label_es': 'Activar AutoPago y ahorrar $5', 'action': 'enable_autopay'},
            ]),
            'diagnosis_flow_enabled': False,
            'diagnosis_intro': '',
            'conversation_context': 'Carlos\'s plan expires in 2 days. He has data remaining but service will cut off at expiry. This is time-sensitive - lead with urgency but don\'t panic him.'
        },
        
        # us-003 - Priya S.
        {
            'persona_id': 'us-003',
            'name': 'Priya S.',
            'avatar': 'PS',
            'dropdown_label': 'Priya S. - Ready to pay, needs confirmation',
            'intent_category': 'refill',
            'urgency': 'high',
            'plan': 'Total Base 5G',
            'plan_price': '$40/mo',
            'data_remaining': '0.3 GB',
            'data_total': '5 GB',
            'data_percent': 6,
            'hotspot_remaining': '0 GB',
            'hotspot_total': '0 GB',
            'renewal_date': datetime.date(2026, 4, 2),
            'days_until_renewal': 7,
            'auto_pay_enabled': False,
            'saved_card': 'Visa ****3377',
            'rewards_points': 1020,
            'rewards_expiring': 0,
            'rewards_expiring_days': 0,
            'device': 'iPhone 13',
            'device_storage': '128 GB',
            'device_storage_used': '98 GB',
            'avg_daily_data_usage_gb': 0.30,
            'wifi_usage_percent': 40,
            'usage_history': json.dumps([
                {'month': 'Nov', 'used': 4.7},
                {'month': 'Dec', 'used': 5.0},
                {'month': 'Jan', 'used': 4.8},
                {'month': 'Feb', 'used': 4.9},
                {'month': 'Mar', 'used': 4.6},
            ]),
            'provider_knows': json.dumps([
                'current data balance (0.3 GB - nearly empty)',
                'plan renewal date (Apr 2, 2026)',
                'rewards points balance (1,020 - enough for free 5 GB add-on)',
                'saved payment card (Visa ****3377)',
                'device storage is 76% full (iPhone 13, 128 GB)',
                'AutoPay is not enabled',
            ]),
            'signals': json.dumps([
                {
                    'id': 'sig-003-a',
                    'severity': 'critical',
                    'icon': '??',
                    'headline': 'Nearly out of data - 0.3 GB left',
                    'subtext': 'Plan renews Apr 2. You may run out before then.',
                },
                {
                    'id': 'sig-003-b',
                    'severity': 'warning',
                    'icon': '??',
                    'headline': '1,020 Rewards Points - free add-on ready',
                    'subtext': 'You can redeem 1,000 pts for a free 5 GB Data Add-On.',
                },
                {
                    'id': 'sig-003-c',
                    'severity': 'info',
                    'icon': '??',
                    'headline': 'Your iPhone 13 storage is 76% full',
                    'subtext': 'Consider a plan with more hotspot to back up over Wi-Fi.',
                },
            ]),
            'user_story': 'As a Total Wireless prepaid customer, I want to review my order and pay in one tap, so that I can complete my refill quickly without fear of being overcharged.',
            'suggested_actions': json.dumps([
                {'label': 'Redeem 1,000 pts - free 5 GB', 'label_es': 'Canjear 1,000 pts - 5 GB gratis', 'action': 'redeem_points'},
                {'label': 'Quick Refill - $15 data add-on', 'label_es': 'Recarga Rápida - complemento $15', 'action': 'quick_refill'},
                {'label': 'Renew full plan early - $40', 'label_es': 'Renovar plan completo antes - $40', 'action': 'renew_early'},
            ]),
            'diagnosis_flow_enabled': False,
            'diagnosis_intro': '',
            'conversation_context': 'Priya has only 0.3 GB left and 7 days until renewal. She has 1,020 Rewards points - enough to redeem a FREE 5 GB data add-on. She may not know this is an option.'
        },
        
        # us-004 - James T.
        {
            'persona_id': 'us-004',
            'name': 'James T.',
            'avatar': 'JT',
            'dropdown_label': 'James T. - New customer, activating SIM',
            'intent_category': 'activate',
            'urgency': 'high',
            'plan': None,
            'plan_price': None,
            'data_remaining': None,
            'data_total': None,
            'data_percent': None,
            'hotspot_remaining': None,
            'hotspot_total': None,
            'renewal_date': None,
            'days_until_renewal': None,
            'auto_pay_enabled': False,
            'saved_card': None,
            'rewards_points': 0,
            'rewards_expiring': 0,
            'rewards_expiring_days': 0,
            'device': 'iPhone 15 Pro',
            'device_storage': '256 GB',
            'device_storage_used': None,
            'avg_daily_data_usage_gb': 0.0,
            'wifi_usage_percent': 0,
            'usage_history': json.dumps([]),
            'provider_knows': json.dumps([
                'device model (iPhone 15 Pro - eSIM compatible)',
                'SIM type selected (eSIM)',
                'account is not yet active',
                '340 welcome points waiting on activation',
            ]),
            'signals': json.dumps([
                {
                    'id': 'sig-004-a',
                    'severity': 'critical',
                    'icon': '??',
                    'headline': 'SIM not yet activated',
                    'subtext': 'Let\'s get you connected - takes about 3 minutes.',
                },
                {
                    'id': 'sig-004-b',
                    'severity': 'info',
                    'icon': '??',
                    'headline': '340 Welcome Points waiting for you',
                    'subtext': 'Activate today and earn 340 Total Rewards points.',
                },
                {
                    'id': 'sig-004-c',
                    'severity': 'info',
                    'icon': '??',
                    'headline': 'You\'re on Verizon 5G towers',
                    'subtext': 'Total Wireless runs on the same network as Verizon - at a fraction of the price.',
                },
            ]),
            'user_story': 'As a new Total Wireless customer, I want to activate my SIM or eSIM in the app, so that I can start using my service without visiting a store.',
            'suggested_actions': json.dumps([
                {'label': 'Activate eSIM on iPhone 15 Pro', 'label_es': 'Activar eSIM en iPhone 15 Pro', 'action': 'activate_esim'},
                {'label': 'Scan physical SIM instead', 'label_es': 'Escanear SIM físico', 'action': 'scan_sim'},
                {'label': 'Port my number from another carrier', 'label_es': 'Portar mi número de otro operador', 'action': 'port_in'},
            ]),
            'diagnosis_flow_enabled': False,
            'diagnosis_intro': '',
            'conversation_context': 'James is a brand new customer. His account is not yet active. This is a welcome + activation flow.'
        },
        
        # us-005 - Angela K.
        {
            'persona_id': 'us-005',
            'name': 'Angela K.',
            'avatar': 'AK',
            'dropdown_label': 'Angela K. - Connectivity issues, called support 5x',
            'intent_category': 'support',
            'urgency': 'high',
            'plan': 'Total Base 5G',
            'plan_price': '$40/mo',
            'data_remaining': '3.4 GB',
            'data_total': '5 GB',
            'data_percent': 68,
            'hotspot_remaining': '0 GB',
            'hotspot_total': '0 GB',
            'renewal_date': datetime.date(2026, 4, 14),
            'days_until_renewal': 19,
            'auto_pay_enabled': True,
            'saved_card': 'Mastercard ****5521',
            'rewards_points': 210,
            'rewards_expiring': 0,
            'rewards_expiring_days': 0,
            'device': 'Samsung Galaxy A54',
            'device_storage': '128 GB',
            'device_storage_used': '67 GB',
            'avg_daily_data_usage_gb': 0.22,
            'wifi_usage_percent': 45,
            'usage_history': json.dumps([
                {'month': 'Nov', 'used': 2.8},
                {'month': 'Dec', 'used': 3.1},
                {'month': 'Jan', 'used': 2.5},
                {'month': 'Feb', 'used': 3.4},
                {'month': 'Mar', 'used': 3.0},
            ]),
            'provider_knows': json.dumps([
                'support call history (5 calls this month)',
                'average signal strength (2 bars - persistently weak)',
                'dropped call count this week (4)',
                'device model (Samsung Galaxy A54)',
                'current plan and data balance',
                'whether there is a known outage in her area',
            ]),
            'signals': json.dumps([
                {
                    'id': 'sig-005-a',
                    'severity': 'critical',
                    'icon': '??',
                    'headline': '5 support calls this month',
                    'subtext': 'You\'ve reached out 5 times - let\'s figure this out together.',
                },
                {
                    'id': 'sig-005-c',
                    'severity': 'warning',
                    'icon': '??',
                    'headline': '4 dropped calls this week',
                    'subtext': 'We see a pattern of dropped calls - this may be a known network issue.',
                },
            ]),
            'user_story': 'As a Total Wireless customer with a service problem, I want to quickly identify and fix my issue without calling support, so that I can resolve it in under 2 minutes.',
            'suggested_actions': json.dumps([
                {'label': 'Check for outages in my area', 'label_es': 'Revisar cortes en mi área', 'action': 'check_outage'},
                {'label': 'Walk me through a fix', 'label_es': 'Guíame para solucionar el problema', 'action': 'self_fix'},
                {'label': 'Talk to someone', 'label_es': 'Hablar con alguien', 'action': 'escalate_support'},
            ]),
            'diagnosis_flow_enabled': True,
            'diagnosis_intro': 'You\'ve called us 5 times this month and we see your average signal is only 2 bars. Let\'s see if we can fix this without another call.',
            'conversation_context': 'Angela has called support 5 times this month. She has persistent signal issues - 2-bar average and 4 dropped calls this week. She is frustrated.'
        },
        
        # us-006 - Derek W.
        {
            'persona_id': 'us-006',
            'name': 'Derek W.',
            'avatar': 'DW',
            'dropdown_label': 'Derek W. - Hit data cap 3 months in a row',
            'intent_category': 'upgrade',
            'urgency': 'upsell',
            'plan': 'Total Base 5G',
            'plan_price': '$40/mo',
            'data_remaining': '0 GB',
            'data_total': '5 GB',
            'data_percent': 0,
            'hotspot_remaining': '0 GB',
            'hotspot_total': '0 GB',
            'renewal_date': datetime.date(2026, 4, 5),
            'days_until_renewal': 10,
            'auto_pay_enabled': True,
            'saved_card': 'Visa ****1144',
            'rewards_points': 890,
            'rewards_expiring': 0,
            'rewards_expiring_days': 0,
            'device': 'Google Pixel 8',
            'device_storage': '128 GB',
            'device_storage_used': '88 GB',
            'avg_daily_data_usage_gb': 0.35,
            'wifi_usage_percent': 35,
            'usage_history': json.dumps([
                {'month': 'Nov', 'used': 5.0},
                {'month': 'Dec', 'used': 5.0},
                {'month': 'Jan', 'used': 5.0},
                {'month': 'Feb', 'used': 5.0},
                {'month': 'Mar', 'used': 5.0},
            ]),
            'provider_knows': json.dumps([
                'data cap hit 3 months in a row (and 10 of last 12)',
                'currently at 0 GB - cap hit again',
                'estimated annual overage spend (~$150/yr on data boosts)',
                'Unlimited plan is only $15 more per month',
                'AutoPay is already enabled',
                'Rewards Points balance (890)',
                'device (Google Pixel 8)',
                'Wi-Fi usage (35% - room to optimize but pattern suggests genuine heavy usage)',
            ]),
            'signals': json.dumps([
                {
                    'id': 'sig-006-a',
                    'severity': 'critical',
                    'icon': '??',
                    'headline': 'You hit your data cap again - 0 GB left',
                    'subtext': 'This is the 3rd month in a row. Unlimited is only $15 more - no caps, ever.',
                },
                {
                    'id': 'sig-006-b',
                    'severity': 'warning',
                    'icon': '??',
                    'headline': 'Cap hit 10 of the last 12 months',
                    'subtext': 'You\'re spending at least $150/year on data boosts you could avoid.',
                },
                {
                    'id': 'sig-006-c',
                    'severity': 'info',
                    'icon': '??',
                    'headline': 'Unlimited includes Disney+',
                    'subtext': 'Upgrading activates Disney+ - a $7.99/mo value included at no extra cost.',
                },
            ]),
            'user_story': 'As a Total Wireless customer who consistently hits my data cap, I want the app to proactively suggest a better plan, so that I can upgrade without searching for the option myself.',
            'suggested_actions': json.dumps([
                {'label': 'Why do I keep hitting my cap?', 'label_es': '¿Por qué sigo alcanzando el límite?', 'action': 'diagnose_usage'},
                {'label': 'Upgrade to Unlimited', 'label_es': 'Cambiar a Ilimitado', 'action': 'upgrade_unlimited'},
                {'label': 'Start at next renewal (no charge today)', 'label_es': 'Iniciar en próxima renovación', 'action': 'upgrade_at_renewal'},
            ]),
            'diagnosis_flow_enabled': True,
            'diagnosis_intro': 'You\'ve hit your cap 10 of the last 12 months. We can look at some usage tips, though with your pattern it may be that your plan simply doesn\'t match how you use your phone.',
            'conversation_context': 'Derek has hit his data cap 3 months in a row and 10 of the last 12 months. He is at 0 GB right now. His pattern strongly suggests his plan doesn\'t match his usage.'
        },
        
        # us-007 - Ana G.
        {
            'persona_id': 'us-007',
            'name': 'Ana G.',
            'avatar': 'AG',
            'dropdown_label': 'Ana G. - International caller, Colombia',
            'intent_category': 'addon',
            'urgency': 'medium',
            'plan': 'Total Base 5G',
            'plan_price': '$40/mo',
            'data_remaining': '3.2 GB',
            'data_total': '5 GB',
            'data_percent': 64,
            'hotspot_remaining': '0 GB',
            'hotspot_total': '0 GB',
            'renewal_date': datetime.date(2026, 4, 11),
            'days_until_renewal': 16,
            'auto_pay_enabled': True,
            'saved_card': 'Visa ****9902',
            'rewards_points': 1200,
            'rewards_expiring': 0,
            'rewards_expiring_days': 0,
            'device': 'Samsung Galaxy S23',
            'device_storage': '256 GB',
            'device_storage_used': '140 GB',
            'avg_daily_data_usage_gb': 0.28,
            'wifi_usage_percent': 50,
            'usage_history': json.dumps([
                {'month': 'Nov', 'used': 3.8},
                {'month': 'Dec', 'used': 4.2},
                {'month': 'Jan', 'used': 3.5},
                {'month': 'Feb', 'used': 3.9},
                {'month': 'Mar', 'used': 3.6},
            ]),
            'provider_knows': json.dumps([
                'international call history (8 calls to Colombia, 94 min; 2 calls to Mexico, 12 min)',
                'estimated per-minute charges this month (~$28)',
                'Global Calling Card would save ~$18/mo on Colombia calls',
                'Rewards Points balance (1,200 - enough for free calling card)',
                'no active add-ons',
                'saved payment card (Visa ****9902)',
            ]),
            'signals': json.dumps([
                {
                    'id': 'sig-007-a',
                    'severity': 'warning',
                    'icon': '??',
                    'headline': 'You called Colombia 8 times this month',
                    'subtext': 'The $10 Global Calling Card saves up to $18/mo on Colombia calls.',
                },
                {
                    'id': 'sig-007-b',
                    'severity': 'info',
                    'icon': '??',
                    'headline': '1,200 Rewards Points - free calling card ready',
                    'subtext': 'You can redeem 1,000 pts for a free Calling Card.',
                },
            ]),
            'user_story': 'As a Total Wireless customer who makes international calls, I want to browse and purchase international add-ons, so that I can stay connected with family abroad affordably.',
            'suggested_actions': json.dumps([
                {'label': 'Global Calling Card - $10/mo', 'label_es': 'Tarjeta de Llamadas Globales - $10/mes', 'action': 'add_global_card'},
                {'label': 'Use 1,000 pts - Free Calling Card', 'label_es': 'Usar 1,000 pts - Tarjeta Gratis', 'action': 'redeem_points'},
                {'label': 'View international rates', 'label_es': 'Ver tarifas internacionales', 'action': 'view_rates'},
            ]),
            'diagnosis_flow_enabled': False,
            'diagnosis_intro': '',
            'conversation_context': 'Ana makes regular international calls to Colombia and Mexico. She has 1,200 Rewards Points - enough to redeem a FREE Global Calling Card. She may not know about the cost savings or the points redemption option.'
        },
        
        # us-008 - Robert L.
        {
            'persona_id': 'us-008',
            'name': 'Robert L.',
            'avatar': 'RL',
            'dropdown_label': 'Robert L. - Phone upgrade eligible',
            'intent_category': 'phone',
            'urgency': 'upsell',
            'plan': 'Total Base 5G',
            'plan_price': '$40/mo',
            'data_remaining': '2.8 GB',
            'data_total': '5 GB',
            'data_percent': 56,
            'hotspot_remaining': '0 GB',
            'hotspot_total': '0 GB',
            'renewal_date': datetime.date(2026, 4, 18),
            'days_until_renewal': 23,
            'auto_pay_enabled': True,
            'saved_card': 'Amex ****7823',
            'rewards_points': 450,
            'rewards_expiring': 0,
            'rewards_expiring_days': 0,
            'device': 'iPhone 11',
            'device_storage': '64 GB',
            'device_storage_used': '58 GB',
            'avg_daily_data_usage_gb': 0.26,
            'wifi_usage_percent': 42,
            'usage_history': json.dumps([
                {'month': 'Nov', 'used': 3.2},
                {'month': 'Dec', 'used': 3.5},
                {'month': 'Jan', 'used': 3.0},
                {'month': 'Feb', 'used': 3.3},
                {'month': 'Mar', 'used': 3.1},
            ]),
            'provider_knows': json.dumps([
                'device age (iPhone 11 - 4+ years old)',
                'storage nearly full (58/64 GB used)',
                'device performance issues reported',
                'upgrade eligibility (24 months on current plan)',
                'rewards points balance (450)',
                'AutoPay enabled',
                'payment method on file (Amex ****7823)',
            ]),
            'signals': json.dumps([
                {
                    'id': 'sig-008-a',
                    'severity': 'warning',
                    'icon': '??',
                    'headline': 'iPhone 11 storage 90% full',
                    'subtext': 'Consider an upgrade with more storage for photos and apps.',
                },
                {
                    'id': 'sig-008-b',
                    'severity': 'info',
                    'icon': '??',
                    'headline': 'Phone upgrade eligible',
                    'subtext': 'You\'ve been with us 24 months - upgrade deals available.',
                },
                {
                    'id': 'sig-008-c',
                    'severity': 'info',
                    'icon': '??',
                    'headline': '450 Rewards Points available',
                    'subtext': 'Apply points toward your next phone purchase.',
                },
            ]),
            'user_story': 'As a Total Wireless customer with an aging phone, I want to browse and upgrade to a newer device, so that I can get better performance and more storage without switching carriers.',
            'suggested_actions': json.dumps([
                {'label': 'Browse new phones', 'label_es': 'Ver nuevos teléfonos', 'action': 'browse_phones'},
                {'label': 'iPhone 15 deals', 'label_es': 'Ofertas iPhone 15', 'action': 'iphone_deals'},
                {'label': 'Trade-in my iPhone 11', 'label_es': 'Cambiar mi iPhone 11', 'action': 'trade_in'},
            ]),
            'diagnosis_flow_enabled': False,
            'diagnosis_intro': '',
            'conversation_context': 'Robert has an iPhone 11 that\'s 4+ years old with nearly full storage. He\'s eligible for an upgrade and has 450 Rewards Points. He may be experiencing performance issues and storage constraints.'
        },
        
        # us-009 - Alex M.
        {
            'persona_id': 'us-009',
            'name': 'Alex M.',
            'avatar': 'AM',
            'dropdown_label': 'Alex M. - Family plan inquiry',
            'intent_category': 'compare',
            'urgency': 'medium',
            'plan': 'Total Base 5G',
            'plan_price': '$40/mo',
            'data_remaining': '1.5 GB',
            'data_total': '5 GB',
            'data_percent': 30,
            'hotspot_remaining': '0 GB',
            'hotspot_total': '0 GB',
            'renewal_date': datetime.date(2026, 4, 7),
            'days_until_renewal': 12,
            'auto_pay_enabled': False,
            'saved_card': 'Visa ****3344',
            'rewards_points': 220,
            'rewards_expiring': 0,
            'rewards_expiring_days': 0,
            'device': 'OnePlus Nord N200',
            'device_storage': '128 GB',
            'device_storage_used': '85 GB',
            'avg_daily_data_usage_gb': 0.24,
            'wifi_usage_percent': 38,
            'usage_history': json.dumps([
                {'month': 'Nov', 'used': 3.0},
                {'month': 'Dec', 'used': 3.2},
                {'month': 'Jan', 'used': 2.8},
                {'month': 'Feb', 'used': 3.1},
                {'month': 'Mar', 'used': 2.9},
            ]),
            'provider_knows': json.dumps([
                'single line customer (potential family plan interest)',
                'moderate data usage patterns',
                'no AutoPay enabled',
                'rewards points balance (220)',
                'device (OnePlus Nord N200)',
                'payment method on file (Visa ****3344)',
            ]),
            'signals': json.dumps([
                {
                    'id': 'sig-009-a',
                    'severity': 'info',
                    'icon': '??',
                    'headline': 'Family plans save $10/line',
                    'subtext': '2+ lines could save you money vs individual plans.',
                },
                {
                    'id': 'sig-009-b',
                    'severity': 'info',
                    'icon': '??',
                    'headline': 'AutoPay saves $5/mo',
                    'subtext': 'Enable AutoPay on any plan for monthly savings.',
                },
            ]),
            'user_story': 'As a Total Wireless customer considering adding family members, I want to compare family plan options and pricing, so that I can make the best decision for my budget and needs.',
            'suggested_actions': json.dumps([
                {'label': 'Compare family plans', 'label_es': 'Comparar planes familiares', 'action': 'compare_plans'},
                {'label': 'Calculate family savings', 'label_es': 'Calcular ahorros familiares', 'action': 'calculate_savings'},
                {'label': 'Add a family member', 'label_es': 'Agregar un miembro familiar', 'action': 'add_family_line'},
            ]),
            'diagnosis_flow_enabled': False,
            'diagnosis_intro': '',
            'conversation_context': 'Alex is a single line customer who may be interested in family plans. He has moderate usage and hasn\'t enabled AutoPay. He could benefit from both family pricing and AutoPay savings.'
        },
        
        # us-010 - Nina P.
        {
            'persona_id': 'us-010',
            'name': 'Nina P.',
            'avatar': 'NP',
            'dropdown_label': 'Nina P. - New phone activation',
            'intent_category': 'activate',
            'urgency': 'high',
            'plan': None,
            'plan_price': None,
            'data_remaining': None,
            'data_total': None,
            'data_percent': None,
            'hotspot_remaining': None,
            'hotspot_total': None,
            'renewal_date': None,
            'days_until_renewal': None,
            'auto_pay_enabled': False,
            'saved_card': None,
            'rewards_points': 0,
            'rewards_expiring': 0,
            'rewards_expiring_days': 0,
            'device': 'Moto G Stylus 2025',
            'device_storage': '256 GB',
            'device_storage_used': None,
            'avg_daily_data_usage_gb': 0.0,
            'wifi_usage_percent': 0,
            'usage_history': json.dumps([]),
            'provider_knows': json.dumps([
                'device model (Moto G Stylus 2025 - just purchased)',
                'SIM type (physical SIM)',
                'new customer activation',
                '340 welcome points available',
            ]),
            'signals': json.dumps([
                {
                    'id': 'sig-010-a',
                    'severity': 'info',
                    'icon': '??',
                    'headline': 'Ready to activate your new phone?',
                    'subtext': 'Takes about 5 minutes. Your number transfers automatically.',
                },
            ]),
            'user_story': 'As a new Total Wireless customer with a new phone, I want to activate my device and choose a plan, so that I can start using my service immediately.',
            'suggested_actions': json.dumps([
                {'label': 'Activate my new phone', 'label_es': 'Activar mi nuevo teléfono', 'action': 'activate_phone'},
                {'label': 'Port my current number', 'label_es': 'Transferir mi número actual', 'action': 'port_number'},
                {'label': 'Pick a plan', 'label_es': 'Elegir un plan', 'action': 'pick_plan'},
            ]),
            'diagnosis_flow_enabled': False,
            'diagnosis_intro': '',
            'conversation_context': 'Nina just bought a Moto G Stylus 2025 with a physical SIM. She needs to activate it on Total Wireless. Guide her through activation and plan selection.'
        }
    ]
    
    return pd.DataFrame(personas)

def generate_complete_intents():
    """Generate ALL intents from the original intentmap.js file"""
    
    intents = [
        {
            'intent_key': 'quick_refill',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'almost out', 'running low', 'low on data', 'need more data',
                'add data', 'buy data', 'quick refill', 'top up', 'top-up',
                'data add-on', 'ran out', 'just ran out', 'out of data right now',
                'refill', 'expir', 'renew my plan', 'autopay',
            ]),
            'negations': json.dumps(["don't need data", 'not running out', 'still have plenty']),
            'description': 'User wants to quickly refill data or renew plan',
            'category': 'refill',
            'priority': 1
        },
        {
            'intent_key': 'diagnose_usage',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'why am i', 'why do i', 'keep running out', 'using so much data',
                'why is my data', 'why does my data', 'how do i use less',
                'where is my data', 'what is using my data', 'data keeps draining',
                'diagnose why', 'diagnose the', 'figure out why', 'find out why',
                "what's using my", 'why it keeps', 'why i keep', 'why does it',
                'check my usage', 'check usage', 'analyze my data', 'investigate',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants to understand why they are using so much data',
            'category': 'support',
            'priority': 2
        },
        {
            'intent_key': 'plan_change',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'change my plan', 'switch my plan', 'different plan', 'cheaper plan',
                'lower my plan', 'downgrade', 'change plan', 'smaller plan',
                'switch to a cheaper', 'want a different plan',
            ]),
            'negations': json.dumps(["don't want to switch", 'stay on my plan', 'keep my plan']),
            'description': 'User wants to change their current plan',
            'category': 'upgrade',
            'priority': 3
        },
        {
            'intent_key': 'upgrade_now',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'upgrade', 'unlimited plan', 'get unlimited', 'need unlimited',
                'better plan', 'bigger plan', 'more data plan', '55/mo',
                'upgrade my plan', 'want unlimited', 'switch to unlimited',
            ]),
            'negations': json.dumps([
                "don't want to upgrade", "don't need unlimited", 'no upgrade',
                'not looking to upgrade', 'not upgrading', "don't upgrade",
                "don't want unlimited",
            ]),
            'description': 'User wants to upgrade to a better plan',
            'category': 'upgrade',
            'priority': 4
        },
        {
            'intent_key': 'browse_phones',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'new phone', 'replace my phone', 'buy a phone', 'get a new phone',
                'phone upgrade', 'looking for a phone', 'show me phones',
                'browse phones', 'phone options', 'what phones do you have',
                'thinking about getting a phone',
            ]),
            'negations': json.dumps(['keep my phone', 'not getting a phone', 'no new phone']),
            'description': 'User wants to browse phone options',
            'category': 'phone',
            'priority': 5
        },
        {
            'intent_key': 'browse_plans',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'what plans do you', 'show me plans', 'view plans', 'all plans',
                'plan options', 'available plans', 'see your plans',
                'what plans are', 'what do you offer', 'what plans do you have',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants to see available plans',
            'category': 'upgrade',
            'priority': 6
        },
        {
            'intent_key': 'international',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'international', 'calling card', 'call abroad', 'call overseas',
                'call mexico', 'call colombia', 'call my family', 'global call',
                'roaming', 'travel abroad', 'family in mexico', 'family abroad',
                'family overseas', 'international calls', 'call internationally',
                'call back home',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants international calling options',
            'category': 'addon',
            'priority': 7
        },
        {
            'intent_key': 'support',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'dropped calls', 'dropping calls', 'calls keep dropping',
                'no signal', 'bad signal', 'poor signal', 'weak signal',
                'outage', 'network issue', 'connectivity issue',
                'signal issue', 'losing signal', 'keeps dropping', 'dead zone',
                'bars of signal', 'phone keeps cutting out',
            ]),
            'negations': json.dumps([]),
            'description': 'User is experiencing technical issues',
            'category': 'support',
            'priority': 8
        },
        {
            'intent_key': 'browse_rewards',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'rewards', 'my points', 'reward points', 'loyalty points',
                'redeem points', 'how many points', 'points balance',
                'my rewards', 'earn points', 'use my points', 'points expir',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants to check or use rewards points',
            'category': 'addon',
            'priority': 9
        },
        {
            'intent_key': 'done',
            'intent_type': 'primary',
            'phrases': json.dumps([
                'never mind', "that's all", 'thats all', 'go home', 'return home',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants to end the conversation',
            'category': 'general',
            'priority': 10
        },
        {
            'intent_key': 'slow-data',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'slow data', 'slow internet', 'slow speed', 'internet is slow',
                'really slow', 'data is slow', 'buffering', 'loading slowly',
                'speeds are slow', 'my data is slow', 'data feels slow',
            ]),
            'negations': json.dumps([]),
            'description': 'User is experiencing slow data speeds',
            'category': 'support',
            'priority': 11
        },
        {
            'intent_key': 'runs-out',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'run out', 'runs out', 'always run out', 'run out before',
                'run out every', 'end of the month', 'before the month is over',
                'data at end of',
            ]),
            'negations': json.dumps([]),
            'description': 'User frequently runs out of data',
            'category': 'support',
            'priority': 12
        },
        {
            'intent_key': 'slow-phone',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'slow phone', 'phone is slow', 'sluggish', 'phone freezes',
                'phone lags', 'lagging phone', 'phone is sluggish',
            ]),
            'negations': json.dumps([]),
            'description': 'User is experiencing slow phone performance',
            'category': 'support',
            'priority': 13
        },
        {
            'intent_key': 'storage',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'storage full', 'out of space', 'no space', 'phone storage',
                'phone is full', 'not enough storage', 'running out of storage',
            ]),
            'negations': json.dumps([]),
            'description': 'User is running out of phone storage',
            'category': 'support',
            'priority': 14
        },
        {
            'intent_key': 'camera',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'better camera', 'better photos', 'better pictures',
                'photo quality', 'picture quality', 'take better photos',
                'camera quality',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants better camera quality',
            'category': 'phone',
            'priority': 15
        },
        {
            'intent_key': 'cost',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'save money', 'spend less', 'lower cost', 'reduce my bill',
                'lower my bill', 'affordable plan', 'best value plan',
                'cost less on my', 'want to save',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants to reduce costs',
            'category': 'upgrade',
            'priority': 16
        },
        {
            'intent_key': 'not-working',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'not working', "isn't working", 'broken', "can't connect",
                'no service', 'phone not working', 'texts not working',
                'calls not working',
            ]),
            'negations': json.dumps([]),
            'description': 'User\'s phone or service is not working',
            'category': 'support',
            'priority': 17
        },
        {
            'intent_key': 'compare',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'compare plans', 'side by side', 'family pricing', 'family plan',
                'multiple lines', 'family lines', 'best deal for family',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants to compare plan options',
            'category': 'upgrade',
            'priority': 18
        },
        {
            'intent_key': 'activate',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'activate sim', 'activate esim', 'activate my phone',
                'set up sim', 'new sim', 'new esim', 'activation',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants to activate a SIM or device',
            'category': 'activate',
            'priority': 19
        },
        {
            'intent_key': 'byop',
            'intent_type': 'granular',
            'phrases': json.dumps([
                'bring my phone', 'bring my own phone', 'byop', 'use my own phone',
                'my own device', 'imei', 'unlocked phone', 'check compatibility',
            ]),
            'negations': json.dumps([]),
            'description': 'User wants to bring their own phone',
            'category': 'activate',
            'priority': 20
        }
    ]
    
    return pd.DataFrame(intents)

def load_complete_personas(client):
    """Load ALL personas to BigQuery"""
    print("Loading ALL personas to BigQuery...")
    
    df = generate_complete_personas()
    
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

def load_complete_intents(client):
    """Load ALL intents to BigQuery"""
    print("Loading ALL intents to BigQuery...")
    
    df = generate_complete_intents()
    
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
    print(f"Loaded {len(df)} intents to dim_intent_mapping")

def main():
    """Main execution function"""
    print("Starting Complete Personas and Intents Data Loader...")
    
    # Initialize BigQuery client
    client = init_client()
    
    # Load all data
    print("\n=== Loading Complete Data ===")
    
    load_complete_personas(client)
    load_complete_intents(client)
    
    print("\n=== Complete Data Loading Finished ===")
    print(f"Dataset: {PROJECT_ID}.{DATASET_ID}")
    print("All personas and intents from original files loaded successfully!")

if __name__ == "__main__":
    main()
