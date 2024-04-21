import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import "../styles/typing.scss";

const TypingChat = ({ word, onSelectionChange }) => {
  const [text, setText] = useState('');
  const [isTypingCompleted, setIsTypingCompleted] = useState(false);
  const typingSpeed = 40; // Adjust typing speed as needed

  useEffect(() => {
    setIsTypingCompleted(false);
    const typeText = async () => {
      for (let j = 0; j <= word.length; j++) {
        setText(word.substring(0, j));
        await new Promise(resolve => setTimeout(resolve, typingSpeed));
      }
      setIsTypingCompleted(true);
    };

    typeText();
  }, [word]); // Re-run the effect when the word prop changes

  return (
    <div className='typingContainer'>
      {isTypingCompleted ? (
        // Once typing is complete, render the Markdown
        <ReactMarkdown children={text} />
      ) : (
        // While typing, show raw text
        <p className='linkText' onMouseUp={onSelectionChange}>{text}</p>
      )}
    </div>
  );
};

export default TypingChat;
