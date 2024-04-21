import React, { useEffect, useState } from 'react'
import { model } from '@/app/gemini'
import { Button, TextField } from '@mui/material';
import "../styles/imageHover.scss";


const ImageHover = ({ generatedText, coord }) => {
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
          parts: [{ text: `You are a location information bank. Describe in short what the image is looking at, and using the coordinates ${coord[0]} ${coord[1]} to assist in that process. The main response is interesting facts about that specific thing in the image if it is recognizable, but otherwise say interesting facts about the surrounding area such as things to do or facts. Keep the information precise to the location without going too far from it. Keep the max word count to 100` }],
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

    const history = [...chat._history]
    history.splice(0, 1)
    setHistory(history);
  }, [])

  const handleSend = async (msg) => {
    setMessage("");
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    
    const updatedHistory = [...chat._history];
    updatedHistory.splice(0, 1); // Same here
    setHistory(updatedHistory);
  }

  if (!chat) {
    return null;
  }


  const handleAskQuestion = () => {
    setAskQuestion(!askQuestion)
  }

  return (
    <div style={{ width: '25%', height: "100%", overflow: "scroll", color: "#FFFFFF" }}>
      <div>
        {history.map((msg, index) => {
          return (
            <div key={index} style={{ fontWeight: `${(index % 2 == 0) ? "bold" : "normal"}`, padding: 10 }}>
              {msg.parts[0] == undefined ? "hello" : msg.parts[0].text}
            </div>
          );
        })}
      </div>
      {
        !askQuestion &&
        (
          <div className="buttonsContainer">
            <Button onClick={() => handleSend("Can you tell me more about this place?")}>Learn More</Button>
            <Button onClick={() => handleAskQuestion()}>Ask Your Own Question</Button>
          </div>)
      }
      {
        askQuestion &&
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