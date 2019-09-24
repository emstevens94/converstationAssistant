import json
import ibm_watson
from ibm_watson import TextToSpeechV1

import sounddevice as sd
import soundfile as sf #Added to solve serial port error on playback
from scipy.io.wavfile import write
from os.path import join, dirname

ASSISTANT_ID = 'c6f0a0ff-df7d-4f15-86aa-d2e1d579d60e'

service=ibm_watson.AssistantV2(
    iam_apikey='8MMYgg1QTkVV5fKvpGtN7ltohcGscem4WTHBN7PNdkf2',
    version='2019-02-28',
    url='https://gateway-wdc.watsonplatform.net/assistant/api'
)

text_to_speech = TextToSpeechV1(
    iam_apikey= 'Cv_HnfQeONg9lZyjB5uUSNQaOoCCmTZKXUCmumRUws1a',
    url = 'https://stream.watsonplatform.net/text-to-speech/api'
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

with open('translation.wav', 'wb') as audio_file:
    audio_file.write(
        text_to_speech.synthesize(
            text,
            voice='en-GB_KateVoice',
            accept='audio/wav'        
        ).get_result().content)

#Takes the given file name, and opens it with the soundfile api to start a play back
filename = 'translation.wav'
# Extract data and sampling rate from file
data, fs = sf.read(filename, dtype='float32')  
sd.play(data, fs)
status = sd.wait() 


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
        with open('translation.wav', 'wb') as audio_file:
            audio_file.write(
                text_to_speech.synthesize(
                    text,
                    voice='en-GB_KateVoice',
                    accept='audio/wav'        
                ).get_result().content)
        
        #Takes the given file name, and opens it with the soundfile api to start a play back
        filename = 'translation.wav'
        # Extract data and sampling rate from file
        data, fs = sf.read(filename, dtype='float32')  
        sd.play(data, fs)
        status = sd.wait() 
        break

    else:
        text = response['output']['generic'][0]['text']
        print("Watson: " + text)
        with open('translation.wav', 'wb') as audio_file:
            audio_file.write(
                text_to_speech.synthesize(
                    text,
                    voice='en-GB_KateVoice',
                    accept='audio/wav'        
                ).get_result().content)

        #Takes the given file name, and opens it with the soundfile api to start a play back
        filename = 'translation.wav'
        # Extract data and sampling rate from file
        data, fs = sf.read(filename, dtype='float32')  
        sd.play(data, fs)
        status = sd.wait() 




# Delete assistant session
delete_info = service.delete_session(
    assistant_id=ASSISTANT_ID,
    session_id=session_info.get('session_id')
).get_result()

#print(json.dumps(delete_info, indent=2))
# test
