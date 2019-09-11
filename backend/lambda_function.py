import json
import ibm_watson
import os

service = ibm_watson.AssistantV2(
    iam_apikey = os.environ['api_key'],
    version = os.environ['version'],
    url = os.environ['url']
)

def lambda_handler(event, context):
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!'),
        
    }
