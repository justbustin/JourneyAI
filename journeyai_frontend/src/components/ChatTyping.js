import React, { useState, useEffect } from 'react';
import "../styles/typing.scss"

const TypingChat = ({ word, onSelectionChange }) => {
  const [text, setText] = useState('');
  const typingSpeed = 20; // Adjust typing speed as needed

  useEffect(() => {
    const typeText = async () => {
      for (let j = 0; j <= word.length; j++) {
        setText(word.substring(0, j));
        await new Promise(resolve => setTimeout(resolve, typingSpeed));
      }
    };

    typeText();
  }, [word]); // Re-run the effect when the word prop changes

  return (
    <div className='typingContainer'>
      <p className='' onMouseUp={onSelectionChange}>{text}</p>
    </div>
  );
};

export default TypingChat;
