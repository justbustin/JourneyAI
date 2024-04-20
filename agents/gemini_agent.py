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
import io

import firebase_admin
from firebase_admin import credentials, storage

# Path to your downloaded service account key
cred_path = 'key.json'  # Ensure this path is correct

# Initialize the app with a service account, granting admin privileges
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'lahacks-8dda9.appspot.com'  # Use your actual storage bucket name
})

# agent1qg592765d2lwmrya9rvdk2m0hw6g4qhaeywjupv3pxz2ycx5gzvw22fp2zr
gemini_agent = Agent(
    name="Gemini Agent",  
    seed="Gemini Agent Seed Phrase",
    port=8003,  
    endpoint="http://localhost:8003/submit",  
)
print(gemini_agent.address)
 
img = PIL.Image.open('./testone.png')

load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

genai.configure(api_key=GOOGLE_API_KEY)


def call_gemini(photo):
    bucket = storage.bucket()  # Access the storage bucket
    blob = bucket.blob(photo.name)  # Create a reference to the specific image

    image_buffer = io.BytesIO()
    blob.download_to_file(image_buffer)
    image_buffer.seek(0)

    img = PIL.Image.open(image_buffer)

    model = genai.GenerativeModel('gemini-1.5-pro-latest')

    response = model.generate_content(["Describe the location and area associated using what can be seen in the image, but most importantly from the longitude and latitude given. ignore people if any. Provide fun facts about the specific landmarks so that user can look into each thing more. latitude: " + photo.latty + " longitude: " + photo.longy, img], stream=True)
    response.resolve()

    return response.text

 
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

UPLOAD_AGENT = "agent1qwwd9dtt3hs2hyas6ax6vcptcz9vapkyqchlnp9j6fzpwn00edd3u5gvk5r"
# Decorator to handle incoming queries.
# this agent receives the firebase photo ID and then sends it to gemini
@gemini_agent.on_message(model=Photo)
async def handle_request(ctx: Context, sender: str, request=Photo):
    text = call_gemini(request)
    await ctx.send(UPLOAD_AGENT, Response(text=text, name=request.name))



if __name__ == "__main__":
    gemini_agent.run()




# user uploads photos

# agent sends a query