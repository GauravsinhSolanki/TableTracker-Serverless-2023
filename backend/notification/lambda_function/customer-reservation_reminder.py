import boto3
import json

sns = boto3.client('sns')
sns_topic_arn = 'arn:aws:sns:us-east-1:247203851890:Reservation-Reminder'  

s3 = boto3.client('s3')
s3_bucket_name = 'subscribedemails'
s3_key = 'riyap.json'  

dynamodb_table_name = os.environ.get('DYNAMODB_TABLE_NAME')

def lambda_handler(event, context):
    for record in event['Records']:
        if record['eventName'] in ['INSERT', 'MODIFY', 'REMOVE']:
            # Extract the restaurant ID and email from the DynamoDB record
            restaurant_id = record['dynamodb']['NewImage']['restaurantId']['S']
            email = record['dynamodb']['NewImage'].get('email', {}).get('S', '')

            # Check if the customer has subscribed to notifications
            if email:
                subscribed = is_customer_subscribed(email)
                if subscribed:
                    message = f"Menu item change detected in restaurant {restaurant_id}."

                
                    sns.publish(
                        TopicArn=sns_topic_arn,
                        Message=message,
                        Subject='Menu Item Change',
                        MessageAttributes={
                            'email': {'DataType': 'String', 'StringValue': email}
                        }
                    )

                    print(f"Sent notification to {email}: {message}")

    return 'Processed DynamoDB Stream events'

def is_customer_subscribed(email):
    try:
      
        response = s3.get_object(
            Bucket=arn:aws:s3:::subscribedemails,
            Key=riyap
        )

  # Parse the JSON data to retrieve the list of subscribed emails
        email_data = json.loads(response['Body'].read().decode('utf-8'))
        subscribed_emails = email_data.get('emails', [])

        # Check if the given email is in the list of subscribed emails
        return email in subscribed_emails

    except Exception as e:
        print(f"Error checking subscription for {email}: {str(e)}")
        return False
