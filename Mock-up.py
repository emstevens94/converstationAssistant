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

response = service.message(
    assistant_id=ASSISTANT_ID,
    session_id=session_info.get('session_id'),
    input={
        'message_type': 'text',
        'text': '',
        'options': {
            'restart': True,
            'debug': True
        }
    }
).get_result()

text = response['output']['generic'][0]['text']
print("Watson: " + text)


while True:
    userinput = input('You: ')
    response = service.message(
        assistant_id=ASSISTANT_ID,
        session_id=session_info.get('session_id'),
        input={
            'message_type': 'text',
            'text': userinput,
            'options': {
                'restart': False,
                'debug' : True
            }
        }
    ).get_result()
    #print(json.dumps(response, indent=2))
    generic = response['output']['generic']
    
    #Added debug to outputs to tell if we fall out of dialog tree hence exit branch
    exitBranch = False
    #Debug will have a length of atleast 3 or more when we exit in the demo tree
    if len(response['output']['debug'])<3:
        exitBranch = False
    else:
        exitBranch = response['output']['debug']['branch_exited']
    

    if  exitBranch:
        text = response['output']['generic'][0]['text']
        print("Watson: " + text)
        break

    else:
        text = response['output']['generic'][0]['text']
        print("Watson: " + text)




# Delete assistant session
delete_info = service.delete_session(
    assistant_id=ASSISTANT_ID,
    session_id=session_info.get('session_id')
).get_result()

#print(json.dumps(delete_info, indent=2))
