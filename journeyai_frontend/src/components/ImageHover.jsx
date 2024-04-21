import React, { useEffect, useState } from 'react'
import { model } from '@/app/gemini'
import { Button, TextField } from '@mui/material';
import "../styles/imageHover.scss";


const ImageHover = ({generatedText}) => {
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);


  const [askQuestion, setAskQuestion] = useState(false);

  useEffect(() => {
    console.log("gentext", generatedText)
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Photo description:" }],
        },
        {
          role: "model",
          parts: [{ text: generatedText }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 3000,
      },
    });

    setChat(chat);
    setHistory([...chat._history]);
  }, [])

  const handleSend = async (msg) => {
    setMessage("");
    setHistory([...history, { role: "user", parts: [{ text: msg }] }])
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    setHistory([...chat._history]);
  }

  if (!chat) {
    return null;
  }


  const handleAskQuestion =  () => {
    setAskQuestion(!askQuestion) 
  }

  return (
    <div>
      <div>
        {history.map((msg, index) => {
          return (
            <div key={index}>
              {msg.role}: {msg.parts[0] == undefined ? "hello" : msg.parts[0].text}
            </div>
          );
        })}
      </div>
      {!askQuestion && 
      (
      <div><Button onClick={() => handleSend("Can you tell me more about this place?")}>Learn More</Button>
      <Button onClick={() => handleAskQuestion()}>Ask Your Own Question</Button></div>)}
      {askQuestion &&
      (<div>
      <TextField value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={() => handleAskQuestion()}> Back </Button>
      <Button onClick={() => handleSend(message)}>
        Send
      </Button>
      </div>)
  }
    </div >
  )
}

export default ImageHover