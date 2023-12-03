import json
import boto3

sns = boto3.client('sns')
sns_topic_arn = 'YOUR_SNS_TOPIC_ARN'  

def lambda_handler(event, context):
    if event.get('Records'):
        # DynamoDB Stream processing for notifications
        for record in event['Records']:
            if record['eventName'] == 'MODIFY':
                # Check if this is a query update (you can define your own logic here)
                if is_query_update(record['dynamodb']['NewImage'], record['dynamodb']['OldImage']):
                    # Compose a message about the query update
                    message = "Query update detected: " + record['dynamodb']['Keys']['queryId']['S']

                    # Send the message to the SNS topic
                    sns_params = {
                        'Message': message,
                        'Subject': 'Query Update',
                        'TopicArn': sns_topic_arn
                    }

                    sns.publish(**sns_params)
                # You can also send messages to specific customers based on the query update

        return 'Processed DynamoDB Stream events'
    elif event.get('httpMethod') == 'POST':
        # Lambda for handling updates to menu items
        if 'pathParameters' not in event or 'Id' not in event['pathParameters']:
            return {
                'statusCode': 400,
                'body': json.dumps('No id specified')
            }

        updated_val = json.loads(event['body'])

        # Add your logic for handling menu item updates here
        # For example, update the menu item with the provided data

        return {
            'statusCode': 200,
            'body': json.dumps('Menu reservation updated successfully')
        }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid request')
        }

def is_query_update(new_image, old_image):
  def is_query_update(new_image, old_image):
    # Example JSON format for new_image and old_image
    new_image_json = {
        "status": "confirmed",
        "other_attribute": "new_value"
        # Add other attributes as needed
    }

    old_image_json = {
        "status": "pending",
        "other_attribute": "old_value"
        # Add other attributes as needed
    }

    # Compare the JSON attributes to identify changes
    if (
        new_image.get("status") == new_image_json.get("status") == "confirmed"
        and old_image.get("status") == old_image_json.get("status") == "pending"
    ):
        return True
    else:
        return False
