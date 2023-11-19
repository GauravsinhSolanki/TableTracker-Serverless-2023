import boto3
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from datetime import datetime, timedelta

# Initialize Firebase Admin SDK
cred = credentials.Certificate(json.loads(os.environ['FIREBASE_CREDENTIALS']))
firebase_admin.initialize_app(cred)

def get_upcoming_reservations_with_menu():
    db = firestore.client()
    now = datetime.utcnow()
    one_hour_later = now + timedelta(hours=1)
    
    reservations = db.collection('restaurantreservation').where('reservation_date', '>=', now).where('reservation_date', '<=', one_hour_later).where('menu_included', '==', True).stream()

    return [reservation.to_dict() for reservation in reservations]

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    reservations = get_upcoming_reservations_with_menu()

    for reservation in reservations:
        message = f"Reminder: Upcoming reservation with menu at {reservation['reservation_date']}"
        sns_client.publish(TopicArn='arn:aws:sns:us-east-1:247203851890:Hourlyreservationreminder', Message=message)

    return {'statusCode': 200, 'body': 'Notifications sent for upcoming reservations with menu'}
