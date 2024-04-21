import pathlib
import textwrap
from datetime import datetime

import google.generativeai as genai

from uagents import Agent, Context, Model

from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import os
import PIL.Image

# Path to your downloaded service account key
cred_path = 'key.json'  # Ensure this path is correct

# Initialize the app with a service account, granting admin privileges
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'lahacks-8dda9.appspot.com'  # Use your actual storage bucket name
})

AGENT_MAILBOX_KEY = "9021d043-aa2f-40a5-afde-e3d0ce5bab4c"
# agent1qwwd9dtt3hs2hyas6ax6vcptcz9vapkyqchlnp9j6fzpwn00edd3u5gvk5r
upload_agent = Agent(
    name="upload agent",  
    seed="upload agent Seed Phrase",
    mailbox=f"{AGENT_MAILBOX_KEY}@https://agentverse.ai",
    port=8004,  
    endpoint="http://localhost:8004/submit",  
)
print(upload_agent.address)
 


def upload_data(response):
    # Access Firestore
    db = firestore.client()

    # Data to write
    data = {
        'text': response.text,
        'time': datetime.now()
    }
    print(response.name)
    parts = response.name.split('/')
    print(parts)
    # Assign the split parts to two separate variables
    directory_name = parts[0]
    file_name = parts[1]

    # Reference to a specific collection and document
    collection_name = directory_name
    document_id = file_name  # Specify your own document ID or use None to auto-generate

    # Write data to Firestore
    doc_ref = db.collection(collection_name).document(document_id)
    doc_ref.set(data)

    print(f'Data written to {collection_name}/{document_id}')

 
class QueryRequest(Model):
    message: str  # The query message.

class Response(Model):
    text: str
    name: str

class Photo(Model):
    name: str
    time: str
    latty: str
    longy: str

UPLOAD_AGENT = ""
# Decorator to handle incoming queries.
# this agent receives the firebase photo ID and then sends it to gemini
@upload_agent.on_message(model=Response)
async def handle_request(ctx: Context, sender: str, request=Response):
    upload_data(request)



if __name__ == "__main__":
    upload_agent.run()