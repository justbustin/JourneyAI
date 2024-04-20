# Importing required libraries
import json
import asyncio
from uagents import Model
from uagents.query import query

import sys
 
# Define the agent's address to send queries to.
AGENT_ADDRESS = "agent1qgfytc9e7ketwqc06xndvjmznqgr3md8w43hzxdv2hasp25ya43j2mnd32e"
 
# Define a model for the query request.
class QueryRequest(Model):
    message: str  
 
# Asynchronous function to send a query to the specified agent.
async def agent_query(req):
    response = await query(destination=AGENT_ADDRESS, message=req, timeout=15.0)
    data = json.loads(response.decode_payload())# Decode the payload from the response and load it as JSON.
    return data["text"]
 
# Asynchronous function to make a call to an agent and handle the response.
async def make_agent_call(req: QueryRequest):
    try:
        response = await agent_query(req)
        return f"successful call - agent response: {response}"
    except Exception:
        return "unsuccessful agent call"
 
# Main block to execute the script.
if __name__ == "__main__":
    # Create a QueryRequest instance with your query and run make_agent_call with request.

    if len(sys.argv) > 1:
        message = sys.argv[1]
        request = QueryRequest(message="20")
        print(asyncio.run(make_agent_call(request)))
    else:
        print("Please provide a message as a command-line argument.")


 