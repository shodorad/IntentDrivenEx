#!/usr/bin/env python3
"""
Show current data comparison: existing project (products.js) vs BigQuery.
"""

from pathlib import Path
from google.cloud import bigquery

def bq_query(sql):
    client = bigquery.Client(project="data-practice-472314")
    return [dict(row) for row in client.query(sql)]

def main():
    bq_plans = bq_query("SELECT plan_id, plan_name, price_usd, tier FROM `data-practice-472314.telecom_demo.dim_plan` ORDER BY price_usd")
    bq_devices = bq_query("SELECT device_id, brand, model, storage_gb FROM `data-practice-472314.telecom_demo.dim_device` ORDER BY brand, model")

    print("=== BigQuery Data (telecom_demo) ===")
    print("\n--- dim_plan ---")
    for r in bq_plans:
        print(f"plan_id={r['plan_id']}, plan_name={r['plan_name']}, price=${r['price_usd']}, tier={r['tier']}")
    print("\n--- dim_device ---")
    for r in bq_devices:
        print(f"device_id={r['device_id']}, brand={r['brand']}, model={r['model']}, storage={r['storage_gb']}GB")

    print("\n\n=== Existing Project Data (products.js) ===")
    print("\n--- Plans (key fields) ---")
    print("id='base-5g', name='Total Base 5G Unlimited', price=20")
    print("id='5g-unlimited', name='Total 5G Unlimited', price=55")
    print("id='5g-plus-unlimited', name='Total 5G+ Unlimited', price=65")
    print("\n--- Phones (key fields) ---")
    print("id='moto-g-stylus-2025', brand='Motorola', model='Moto G Stylus 2025', storage='256GB'")
    print("id='samsung-galaxy-a17-5g', brand='Samsung', model='Samsung Galaxy A17 5G', storage='128GB'")
    print("id='samsung-galaxy-a36-5g', brand='Samsung', model='Samsung Galaxy A36 5G', storage='128GB'")
    print("id='iphone-13', brand='Apple', model='iPhone 13', storage='128GB'")

if __name__ == "__main__":
    main()
