import React, { useState, useEffect } from 'react';
import "../styles/typing.scss"

const TypingLinkAnimation = ({ word }) => {
  const [text, setText] = useState('');
  const typingSpeed = 75; // Adjust typing speed as needed

  useEffect(() => {
    const typeText = async () => {
      await new Promise(resolve => setTimeout(resolve, 1400));
      for (let j = 0; j <= word.length; j++) {
        setText(word.substring(0, j));
        await new Promise(resolve => setTimeout(resolve, typingSpeed));
      }
    };

    typeText();
  }, [word]); // Re-run the effect when the word prop changes

  return (
    <div className='typingContainer'>
      <h2 className='linkText'>{text}</h2>
    </div>
  );
};

export default TypingLinkAnimation;
