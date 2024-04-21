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

AGENT_MAILBOX_KEY = "ab0cd521-5574-4238-b52f-377e55f759b5"
# agent1qg592765d2lwmrya9rvdk2m0hw6g4qhaeywjupv3pxz2ycx5gzvw22fp2zr
gemini_agent = Agent(
    name="Gemini Agent",  
    seed="Gemini Agent Seed Phrase",
    mailbox=f"{AGENT_MAILBOX_KEY}@https://agentverse.ai",
    port=8003,  
    endpoint="http://localhost:8003/submit",  
)
print(gemini_agent.address)
 

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
    
    system = """Generate a response that is a JSON file that is an array of JSON objects. Each object should contain 4 fields, the first field being the location name with the label 'name' and be as specific as possible, the second field being the description of what the image is looking at with the label 'description' and be sure to note any recognizable land mark or famous thing in the photo if any, the third field being a description with the label 'facts', the fourth field being things to do around the area with the label being 'events', and the fifth being the name of the location or landmark with the label 'landmark'. If the the location is not well known or not a well known place, then set 'landmark' to null. The facts should be interesting and detailed. The events should be specific to that area and close in proximity to the provided location. All the keys in the JSON object should be camel case if it is multiple words."""
    
    prompt = """You are a location information bank. Describe what the image is looking at, and using the coordinates {} {}
      to assist in that process. The main response is interesting facts about that specific thing in the image if it is recognizable, 
      but otherwise say interesting facts about the surrounding area such as things to do or facts. Keep the information precise to the 
      location without going too far from it. Keep the max word count to 350. {}""".format(photo.latty, photo.longy, system)

    response = model.generate_content([prompt, img], stream=True)
    response.resolve()
    print(response.text)
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