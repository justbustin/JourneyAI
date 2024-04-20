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

img = PIL.Image.open('./testone.png')

load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-1.5-pro-latest')

#response = model.generate_content(["Describe the location and area associated in the background. Provide fun facts about the specific landmarks so that user can look into each thing more. Use this metadata to assist in the information: 35.65934° N, 139.70065° E Shibuya - dogenzaka", img], stream=True)
#response.resolve()

#print(response.text)
 
alice = Agent(
    name="Query Agent",  
    seed="Query Agent Seed Phrase",
    port=8001,  
    endpoint="http://localhost:8001/submit",  
)
print(alice.address)
 
#@alice.on_interval(period=2.0)
#async def say_hello(ctx: Context):
#    ctx.logger.info(f'hello, my name is {ctx.name}')


class QueryRequest(Model):
    message: str  # The query message.
 
class Response(Model):
    text: str

class RequestGemini(Model):
    text: str

REORDER_AGENT = "agent1qd9xvl8x9k92j4ueg575p83w4z7v6yywgj88kws2k2g75h6nz2ecvt9eytm"

# Decorator to handle incoming queries.
# this agent loops through all the agents and sends a request to next agent in pipeline to call gemini on the photo
@alice.on_query(model=QueryRequest)
async def query_handler(ctx: Context, sender: str, _query: QueryRequest):
    ctx.logger.info("Query received")  # Log receipt of query.
    try:
        await ctx.send(REORDER_AGENT, QueryRequest(message=_query.message))
    except Exception as e:
        print(e)
        await ctx.send(sender, Response(text="fail"))
 



if __name__ == "__main__":
    alice.run()




# user uploads photos

# agent sends a query