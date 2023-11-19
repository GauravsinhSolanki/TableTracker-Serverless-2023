import boto3
import json
import os
import datetime
from firebase_admin import credentials
import http.client
from urllib.parse import urlparse

sns = boto3.client('sns')
s3 = boto3.client('s3')

getByIdApiUrl = "https://gw8fpox6c3.execute-api.us-east-1.amazonaws.com/dev/restaurant-reservations/"

def lambda_handler(event):
    try:
    
        reservationId = event['reservationId']

 
        url = urlparse(getByIdApiUrl + reservationId)
        conn = http.client.HTTPSConnection(url.netloc)
        conn.request("GET", url.path)
        response = conn.getresponse()

     
        if response.status != 200:
            raise ValueError(f"Failed to fetch data with status code: {response.status}")

        data = response.read().decode('utf-8')
        reservation_data = json.loads(data).get('data', {})
        
        reservation_datetime = datetime.datetime.strptime(reservation_data.get('reservation_date', ''), '%Y-%m-%dT%H:%M:%S.%fZ')
        current_datetime = datetime.datetime.utcnow()

      
        if (reservation_datetime - current_datetime).total_seconds() <= 1800:
            email = fetch_email_by_user_id(reservation_data.get('user_id', ''))
            if not email:
                raise ValueError("Failed to fetch email for the user.")
            
            if is_customer_subscribed(email):
                restaurant_name = fetch_restaurant_name_by_id(reservation_data.get('restaurant_id', ''))
                if not restaurant_name:
                    raise ValueError("Failed to fetch restaurant name.")
                
           
                message = f"Reminder: You have a reservation at {restaurant_name} in 30 minutes."
                sns.publish(
                    TopicArn="arn:aws:sns:us-east-1:247203851890:Reservation-Reminder",
                    Message=message,
                    Subject='Reservation Reminder',
                    MessageAttributes={
                        'email': {'DataType': 'String', 'StringValue': email}
                    }
                )
                print(f"Sent notification to {email}: {message}")

        return 'Processed reservation reminder'
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return str(e)

def is_customer_subscribed(email):
    try:
        response = s3.get_object(
            Bucket=s3_bucket_name,
            Key=s3_key
        )
        email_data = json.loads(response['Body'].read().decode('utf-8'))
        subscribed_emails = email_data.get('emails', [])
        return email in subscribed_emails

    except Exception as e:
        print(f"Error checking subscription for {email}: {str(e)}")
        return False

def fetch_email_by_user_id(uid):
    
    return "example@example.com"

def fetch_restaurant_name_by_id(restaurant_id):
    
    return "Example Restaurant"