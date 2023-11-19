import boto3
from datetime import datetime, timedelta
import pytz

sns_client = boto3.client('sns')

def fetch_reservations_with_menu():
    #  logic to fetch reservations from the database
    return reservations

def lambda_handler(event, context):
    reservations = fetch_reservations_with_menu()
    now = datetime.now(pytz.utc)

    for reservation in reservations:
        reservation_time = reservation['time'] 
        if now + timedelta(hours=1) >= reservation_time:
  
            message = f"Reminder: You have a reservation with a menu at {reservation_time}"
            sns_client.publish(
                TopicArn='arn:aws:sns:us-east-1:247203851890:newreservationtorestaurants',
                Message=message
            )

    return 
{
    'statusCode': 200, 
    'body': 'Notifications sent for reservations with a menu'
}
