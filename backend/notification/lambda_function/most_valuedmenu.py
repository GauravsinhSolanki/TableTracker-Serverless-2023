import boto3
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from collections import Counter

cred = credentials.Certificate(json.loads(os.environ['FIREBASE_CREDENTIALS']))
firebase_admin.initialize_app(cred)

def check_overbooked_tables():
    db = firestore.client()
    overbooked_tables = []
    now = datetime.utcnow()

    end_window = now + timedelta(hours=4)


    reservations = db.collection('restaurantreservation').where('reservation_date', '>=', now).where('reservation_date', '<=', end_window).stream()

    table_counts = Counter()
    for reservation in reservations:
        table_counts[reservation.to_dict()['restaurant_id']] += reservation.to_dict()['required_capacity']


    for restaurant_id, count in table_counts.items():
        total_capacity = get_restaurant_capacity(restaurant_id)  
        if count > total_capacity:
            overbooked_tables.append(restaurant_id)

    return overbooked_tables


def get_top_three_menu_items():
    db = firestore.client()
    menu_items_count = Counter()

    menu_reservations = db.collection('menureservations').stream()
    for reservation in menu_reservations:
        for item in reservation.to_dict().get('items', []):
            menu_items_count[item['id']] += item['quantity']

    top_three_items = menu_items_count.most_common(3)
    return top_three_items

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    
    overbooked_tables = check_overbooked_tables()
    top_menu_items = get_top_three_menu_items()

    message = f"Overbooked Tables: {overbooked_tables}, Top 3 Menu Items: {top_menu_items}"
    sns_client.publish(TopicArn='arn:aws:sns:us-east-1:247203851890:Mostloveditems', Message=message)

    return {'statusCode': 200, 'body': 'Notification sent for overbooked tables and top menu items'}
