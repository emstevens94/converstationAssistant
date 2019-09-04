import json
import ibm_watson

ASSISTANT_ID = 'c6f0a0ff-df7d-4f15-86aa-d2e1d579d60e'

service=ibm_watson.AssistantV2(
    iam_apikey='8MMYgg1QTkVV5fKvpGtN7ltohcGscem4WTHBN7PNdkf2',
    version='2019-02-28',
    url='https://gateway-wdc.watsonplatform.net/assistant/api'
)

# Start assistant session
session_info = service.create_session(
    assistant_id=ASSISTANT_ID
).get_result()

print('Session info')
print(json.dumps(session_info, indent=2))

response = service.message(
    assistant_id=ASSISTANT_ID,
    session_id=session_info.get('session_id'),
    input={
        'message_type': 'text',
        'text': '',
        'options': {
            'restart': True
        }
    }
).get_result()

print('Response info')
print(json.dumps(response, indent=2))

# Delete assistant session
delete_info = service.delete_session(
    assistant_id=ASSISTANT_ID,
    session_id=session_info.get('session_id')
).get_result()

print('Delete info')
print(json.dumps(delete_info, indent=2))
