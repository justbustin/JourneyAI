import React, { useEffect, useState } from 'react'
import { model } from '@/app/gemini'
import { Button, TextField } from '@mui/material';
import "../styles/imageHover.scss";
import { styled } from '@mui/material/styles';
import TypingChat from './ChatTyping';
import ReactMarkdown from 'react-markdown';


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
  const [mainHistory, setMainHistory] = useState([]);
  const [askQuestion, setAskQuestion] = useState(false);
  const [askMainQuestion, setAskMainQuestion] = useState(false);
  const [textObject, setTextObject] = useState({});
  const [learnPhotos, setLearnPhotos] = useState([]);

  useEffect(() => {
    console.log("gentext", generatedText)

    const cleanText = generatedText.replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleanText); // Parse the JSON string
    console.log(jsonData)
    setTextObject(jsonData[0]);

    let fullText = ""
    for (const [key, value] of Object.entries(jsonData[0])) {
      fullText += value + " "
    }

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are a location information bank. Describe in short what the image is looking at, and using the coordinates ${coord[0]} ${coord[1]} to assist in that process. The main response is interesting facts about that specific thing in the image if it is recognizable, but otherwise say interesting facts about the surrounding area such as things to do or facts. Keep the information precise to the location without going too far from it. Keep the max word count to 100` }],
        },
        {
          role: "model",
          parts: [{ text: fullText }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 3000,
      },
    });

    setChat(chat);
    setHistory([...chat._history]);
    setMainHistory([...chat._history]);
  }, [])

  const handleSend = async (msg) => {
    console.log(msg)
    const formatted_message = `Can you answer this question ${msg} based on the following highlighted text: ${selectedText} in less than 40 words? Do not mention the word count and do not use markdown syntax.`
    setMessage("");
    const result = await chat.sendMessage(formatted_message);
    const response = await result.response;
    console.log("BEFORE CRASH", response.text)
    const text = response.text();
    console.log(text);
    console.log("setting history2")

    if (textObject.landmark) {
      let photos = await fetchPhotosFromUnsplash(textObject.landmark)
      setLearnPhotos([...photos])
    }

    setHistory([history[0], history[1], { role: "user", parts: [{ text: msg }] }, { role: "model", parts: [{ text: text }] }]);
  }

  const handleMainSend = async (msg) => {
    const formatted_message = `Can you answer this question ${msg} in less than 40 words? Do not mention the word count and do not use markdown syntax.`
    setMessage("");
    const result = await chat.sendMessage(formatted_message);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    console.log("setting history2")
    setMainHistory([history[0], history[1], { role: "user", parts: [{ text: msg }] }, { role: "model", parts: [{ text: text }] }]);
  }

  const onSelectionChange = (e) => {
    console.log(document.getSelection().toString());
    setSelectedText(document.getSelection().toString());
  }

  if (!chat) {
    return null;
  }


  const handleAskQuestion = () => {
    setAskQuestion(!askQuestion);
  }

  const handleAskMainQuestion = () => {
    setAskMainQuestion(!askMainQuestion);
  }

  async function fetchPhotosFromUnsplash(query) {
    const accessKey = "Sf3afF4ntp3zts8hQ541-97Busj4P1YmgraSbupiCBM"; // Replace this with your actual Unsplash access key.
    const url = `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${encodeURIComponent(query)}&per_page=2&order_by=relevant`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.results); // Logs the results to the console
        let photos = [data.results[0].links.download, data.results[1].links.download]
        console.log(photos)
        return photos; // Returns the array of photos
    } catch (error) {
        console.error("Error fetching images from Unsplash:", error);
        return [];
    }
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
                {learnPhotos.length > 0 && <img src={learnPhotos[index]} width="50%" height="50%"/>}
                {index % 2 == 0 || msg.parts[0] == undefined ? "" : <TypingChat onSelectionChange={onSelectionChange} word={msg.parts[0].text}/>}
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
        <div onMouseUp={onSelectionChange} key={1} style={{ paddingLeft: "20px" }} >
          {
          history[1].parts[0] &&
          <div> 
            <h3>{textObject.name}</h3>
            <br/>
            <p>{textObject.description}</p>
            <br/>
            <p>{textObject.facts}</p>
            <br/>
            <p>{textObject.events}</p>
            <br/>
            {textObject.landmark && <p>{textObject.landmark}</p>}
          </div>
          }
        </div>
        {mainHistory.slice(2).map((msg, index) => {
          return (
            <div onMouseUp={onSelectionChange} key={index} style={{ padding: 10 }}>
              {index % 2 == 0 || msg.parts[0] == undefined ? "" : <TypingChat onSelectionChange={onSelectionChange} word={msg.parts[0].text}/>}
            </div>
          );
        })}
        {
          !askMainQuestion &&
          (
            <div className="buttonsContainer">
              <CustomButton variant="contained" onClick={() => handleMainSend("Can you tell me something you haven't said yet about this place?")}>Learn More</CustomButton>
              <CustomButton variant="contained" onClick={() => handleAskMainQuestion()}>Ask Your Own Question</CustomButton>
            </div>)
        }
        {
          askMainQuestion &&
          (<div>
            <CustomTextField value={message} onChange={(e) => setMessage(e.target.value)} />
            <CustomButton onClick={() => handleAskMainQuestion()}> Back </CustomButton>
            <CustomButton onClick={() => handleMainSend(message)}>
              Send
            </CustomButton>
          </div>)
        }
      </div>
    </div >
  )
}

export default ImageHover