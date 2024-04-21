import pathlib
import textwrap

import google.generativeai as genai

from uagents import Agent, Context, Model

from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import os
import PIL.Image
import time

import firebase_admin
from firebase_admin import credentials, storage

# Path to your downloaded service account key
cred_path = 'key.json'  # Ensure this path is correct

# Initialize the app with a service account, granting admin privileges
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'lahacks-8dda9.appspot.com'  # Use your actual storage bucket name
})

def fetch_image(image_path):
    """Fetches an image from Firebase Storage by the specified path."""
    bucket = storage.bucket()  # Access the storage bucket
    blob = bucket.blob(image_path)  # Create a reference to the specific image

    # Download the image to local machine or read it directly
    file_name = image_path.split('/')[-1]
    blob.download_to_filename(file_name)  # Saves the file to the local filesystem
    print(f"Image downloaded as {file_name}")

# Replace 'path/to/image.jpg' with the path of the image in your Firebase Storage

# Replace 'path/to/image.jpg' with the path of the image in your Firebase Storage

def get_photos(id):
    bucket = storage.bucket()  # Access the storage bucket
    blobs = bucket.list_blobs(prefix=id)  # Make sure to include the trailing slash in prefix

    # Print file names
    photos = []
    for blob in blobs:
        blob.reload()
        
        print(blob.name)

        if blob.metadata:
            print("Custom Metadata:")
            test = {"name": blob.name}

            for key, value in blob.metadata.items():
                test[key] = value

            del test['firebaseStorageDownloadTokens']

            photos.append(test)
        else:
            print("No custom metadata available.")
    return photos


def reorder_photos(blobs):
    # Sorting the list of dictionaries based on the 'time' key
    return sorted(blobs, key=lambda x: x['time'])

AGENT_MAILBOX_KEY = "7d1ca833-2cdb-4c7b-8b26-ee069fd39061"
# agent1qd9xvl8x9k92j4ueg575p83w4z7v6yywgj88kws2k2g75h6nz2ecvt9eytm
reorder_agent = Agent(
    name="Reorder Agent",  
    seed="Reorder Agent Seed Phrase",
    mailbox=f"{AGENT_MAILBOX_KEY}@https://agentverse.ai",
    port=8002,  
    endpoint="http://localhost:8002/submit",  
)
print(reorder_agent.address)
 
 
class QueryRequest(Model):
    message: str  # The query message.

class Response(Model):
    text: str

class Photo(Model):
    name: str
    time: str
    latty: str
    longy: str

# Decorator to handle incoming queries.
# this agent receives the firebase photo ID and then sends it to gemini
GEMINI_AGENT = 'agent1qg592765d2lwmrya9rvdk2m0hw6g4qhaeywjupv3pxz2ycx5gzvw22fp2zr'

@reorder_agent.on_message(model=QueryRequest)
async def handle_request(ctx: Context, sender: str, request=QueryRequest):
    ctx.logger.info(f"Got request from")
    
    photos = get_photos(request.message)
    reordered_photos = reorder_photos(photos)
    for photo in reordered_photos:
        await ctx.send(GEMINI_AGENT, Photo(name=photo["name"], time=photo["time"], latty=photo["latitude"], longy=photo["longitude"]))
        time.sleep(4)


if __name__ == "__main__":
    reorder_agent.run()




# user uploads photos

# agent sends a query