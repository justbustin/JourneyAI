import React, { useEffect, useState } from 'react'
import { model } from '@/app/gemini'
import { Button, TextField } from '@mui/material';
import "../styles/ImageHover.scss";


const ImageHover = () => {
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);


  const [askQuestion, setAskQuestion] = useState(false);

  useEffect(() => {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Photo description:" }],
        },
        {
          role: "model",
          parts: [{ text: "You were in Tokyo, Japan." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
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
      <Button>Ask a Question</Button>
      <TextField value={message} onChange={(e) => setMessage(e.target.value)} />

      <Button onClick={() => handleSend(message)}>
        Send
      </Button>
      <div className='hello'>
        Hello
      </div>
    </div >
  )
}

export default ImageHover