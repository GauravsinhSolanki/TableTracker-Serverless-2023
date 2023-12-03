import boto3
import json
import random
from datetime import datetime, timedelta

sns = boto3.client('sns')
s3 = boto3.client('s3')

s3_bucket_name = 'subscribedemails'
s3_key = 'riyap.json'
s3_offer_bucket_name = 'offersbucket'

sns_topic_arn = 'arn:aws:sns:us-east-1:247203851890:ResturantOffers'

def lambda_handler(event):
    try:
        email = event['headers'].get('Email') 
        
        if not email:
            return {
                'statusCode': 400,
                'body': json.dumps('Email header not found')
            }
       
        current_time = datetime.now()
        if current_time.minute == 0:
      
            send_random_offers_to_email(email)
            
        return {
            'statusCode': 200,
            'body': json.dumps('Processed event')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }

def send_random_offers_to_email(email):
    try:
        objects = s3.list_objects(Bucket=s3_offer_bucket_name)
        offer_files = [obj['Key'] for obj in objects.get('Contents', [])]

        selected_offers = random.sample(offer_files, 2)
        offer_messages = []
        for selected_offer in selected_offers:
            response = s3.get_object(Bucket=s3_offer_bucket_name, Key=selected_offer)
            offer_message = response['Body'].read().decode('utf-8')
            offer_messages.append(offer_message)

        send_notification(email, '\n'.join(offer_messages))

    except Exception as e:
        print(f"Error sending random offers: {str(e)}")

def send_notification(email, message):
    try:
        sns.publish(
            TopicArn=sns_topic_arn,
            Message=message,
            Subject='Restaurant Details and Offers',
            MessageAttributes={
                'email': {'DataType': 'String', 'StringValue': email}
            }
        )
    except Exception as e:
        print(f"Error sending notification to {email}: {str(e)}")