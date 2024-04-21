import React, { useEffect, useState } from 'react'
import { model } from '@/app/gemini'
import { Button, TextField } from '@mui/material';
import "../styles/imageHover.scss";
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)({
  backgroundColor: "white",
  margin: 1,
  '& label.Mui-focused': {
    color: 'black',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
})

const CustomButton = styled(Button)({
  margin: 3,
  backgroundColor: 'white',
  color: 'black',
  borderRadius: 8,
  '&:hover': {
    backgroundColor: 'black',
    color: "white",
    borderColor: 'white',
    boxShadow: 'none',
  },
});

const ImageHover = ({ generatedText, coord }) => {
  const [selectedText, setSelectedText] = useState("");
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
    console.log("setting history")
    setHistory([...chat._history]);
  }, [])

  const handleSend = async (msg) => {
    const formatted_message = `Can you answer this question ${msg} based on the following highlighted text: ${selectedText} in less than 40 words? Do not mention the word count and do not use markdown syntax.`
    setMessage("");
    const result = await chat.sendMessage(formatted_message);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    console.log("setting history2")
    setHistory([history[0], history[1], { role: "user", parts: [{ text: msg }] }, { role: "model", parts: [{ text: text }] }]);
  }

  const onSelectionChange = (e) => {
    console.log(document.getSelection().toString());
    setSelectedText(document.getSelection().toString());
  }

  if (!chat) {
    return null;
  }


  const handleAskQuestion = () => {
    console.log(history);
    setAskQuestion(!askQuestion)
  }

  return (
    <div style={{ width: '25%', height: "100%", overflow: "scroll", color: "#FFFFFF", scrollbarWidth: "thin" }}>
      {selectedText &&
        <div className="selectedChat">
          <div style={{ padding: 10, fontWeight: "bolder" }}>
            {selectedText}
          </div>
          {history.slice(2).map((msg, index) => {
            return (
              <div key={index} style={{ padding: 10 }}>
                {index % 2 == 0 || msg.parts[0] == undefined ? "" : msg.parts[0].text}
              </div>
            );
          })}
          {
            !askQuestion &&
            (
              <div className="buttonsContainer">
                <CustomButton variant="contained" onClick={() => handleSend("Can you tell me something you haven't said yet about this place?")}>Learn More</CustomButton>
                <CustomButton variant="contained" onClick={() => handleAskQuestion()}>Ask Your Own Question</CustomButton>
              </div>)
          }
          {
            askQuestion &&
            (<div>
              <CustomTextField value={message} onChange={(e) => setMessage(e.target.value)} />
              <CustomButton onClick={() => handleAskQuestion()}> Back </CustomButton>
              <CustomButton onClick={() => handleSend(message)}>
                Send
              </CustomButton>
            </div>)
          }
        </div>
      }
      <div>
        <div onMouseUp={onSelectionChange} key={1} style={{ padding: 10 }}>
          {history[1].parts[0] == undefined ? "" : history[1].parts[0].text}
        </div>
      </div>
    </div >
  )
}

export default ImageHover