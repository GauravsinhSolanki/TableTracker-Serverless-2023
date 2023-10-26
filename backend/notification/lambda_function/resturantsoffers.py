import boto3
import json
import random
from datetime import datetime, timedelta

sns = boto3.client('sns')
s3 = boto3.client('s3')
dynamodb = boto3.client('dynamodb')

s3_bucket_name = 'subscribedemails'
s3_key = 'riyap.json'
s3_offer_bucket_name = 'offersbucket'
dynamodb_table_name = 'your-dynamodb-table-name'  # Replace with your DynamoDB table name

# Define your SNS topic ARN
sns_topic_arn = 'arn:aws:sns:us-east-1:247203851890:ResturantOffers'

def lambda_handler(event, context):
    try:
        # Check if it's time to send notifications (every hour)
        current_time = datetime.now()
        if current_time.minute == 0:
            # Send random offers to subscribed emails
            send_random_offers()

            # Fetch details of open restaurants
            open_restaurants = fetch_open_restaurants()

            # Send restaurant details to subscribed emails
            for email_info in open_restaurants:
                email = email_info['email']
                open_restaurants_at_hour = email_info['open_restaurants']

                message = f"Open restaurants at this hour: {', '.join(open_restaurants_at_hour)}"
                send_notification(email, message)

        return {
            'statusCode': 200,
            'body': json.dumps('Processed event')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }

def send_random_offers():
    try:
        # List objects in the S3 offer bucket
        objects = s3.list_objects(Bucket=s3_offer_bucket_name)
        offer_files = [obj['Key'] for obj in objects.get('Contents', [])]

        # Select random offer files (e.g., 2 out of 4)
        selected_offers = random.sample(offer_files, 2)

        # Send selected offer files to subscribed emails
        offer_messages = []
        for selected_offer in selected_offers:
            response = s3.get_object(Bucket=s3_offer_bucket_name, Key=selected_offer)
            offer_message = response['Body'].read().decode('utf-8')
            offer_messages.append(offer_message)

        # Fetch subscribed emails from S3
        response = s3.get_object(Bucket=s3_bucket_name, Key=s3_key)
        email_data = json.loads(response['Body'].read().decode('utf-8'))
        subscribed_emails = email_data.get('emails', [])

        for email_info in subscribed_emails:
            email = email_info['email']
            send_notification(email, '\n'.join(offer_messages))
    except Exception as e:
        print(f"Error sending random offers: {str(e)}")

def fetch_open_restaurants():
    try:
        current_time = datetime.now()
        current_time_str = current_time.strftime('%Y-%m-%d %H:%M:%S')

        # Query DynamoDB to fetch details of open restaurants
        response = dynamodb.scan(
            TableName=dynamodb_table_name,
            FilterExpression="opening_time <= :current_time and closing_time >= :current_time",
            ExpressionAttributeValues={':current_time': current_time_str}
        )

        open_restaurants = []
        for item in response['Items']:
            restaurant_name = item['restaurant_name']
            open_restaurants.append(restaurant_name)

        return open_restaurants
    except Exception as e:
        print(f"Error fetching open restaurant details: {str(e)}")

def send_notification(email, message):
    try:
        # Send a notification to the subscribed email using SNS
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