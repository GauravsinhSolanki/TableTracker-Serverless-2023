import boto3
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from datetime import datetime, timedelta


cred = credentials.Certificate(json.loads(os.environ['FIREBASE_CREDENTIALS']))
firebase_admin.initialize_app(cred)

def get_upcoming_reservations_without_menu():
    db = firestore.client()
    now = datetime.utcnow()
    ten_minutes_later = now + timedelta(minutes=10)
    
    reservations = db.collection('restaurantreservation').where('reservation_date', '>=', now).where('reservation_date', '<=', ten_minutes_later).where('menu_included', '==', False).stream()

    return [reservation.to_dict() for reservation in reservations]

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    reservations = get_upcoming_reservations_without_menu()

    for reservation in reservations:
        message = f"Reminder: Upcoming reservation without menu at {reservation['reservation_date']}"
        sns_client.publish(TopicArn='arn:aws:sns:us-east-1:247203851890:WithoutMenu_reservation', Message=message)

    return {'statusCode': 200, 'body': 'Notifications sent for upcoming reservations without menu'}
