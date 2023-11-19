import json
import boto3

sns = boto3.client('sns')
sns_topic_arn = 'arn:aws:sns:us-east-1:247203851890:closer'

def lambda_handler(event):
 
    email = event.get("email")
    closure_reason = event.get("reason", "Unexpected circumstances")

    message = f"The restaurant has closed suddenly due to: {closure_reason}. We apologize for the inconvenience. Email from session: {email}."
    
    response = send_notification_to_customers(message)

    return {
        'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
        'body': json.dumps('Notification sent successfully')
    }

def send_notification_to_customers(message):
    try:
        response = sns.publish(
            TopicArn=sns_topic_arn,
            Message=message,
            Subject='Urgent: Restaurant Closure Notification'
        )
        return response
    except Exception as e:
        print(f"Error sending notification: {str(e)}")
        raise e
