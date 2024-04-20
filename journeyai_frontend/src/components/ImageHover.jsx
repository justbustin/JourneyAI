import React, { useEffect, useState } from 'react'
import { model } from '@/app/gemini'

const ImageHover = () => {
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

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
              {msg.role}: {msg.parts[0].text}
            </div>
          );
        })}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => handleSend(message)}>
        Send
      </button>
    </div >
  )
}

export default ImageHover