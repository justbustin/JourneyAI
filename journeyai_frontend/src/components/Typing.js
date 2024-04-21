import React, { useState, useEffect } from 'react';
import "../styles/typing.scss"


const TypingAnimation = ({ texts, typingSpeed }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeText = () => {
      const currentText = texts[currentTextIndex];
      // If deleting, remove one character
      if (isDeleting) {
        setDisplayText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else {
        // If not deleting, add one character
        setDisplayText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }

      // Toggle between typing and deleting
      if (!isDeleting && charIndex === currentText.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        // Move to the next text when the current text is fully deleted
        setCurrentTextIndex((currentTextIndex + 1) % texts.length);
      }
    };

    const timeout = setTimeout(typeText, typingSpeed);

    // Clear timeout on component unmount
    return () => clearTimeout(timeout);
  }, [displayText, charIndex, isDeleting, currentTextIndex, texts, typingSpeed]);

  return <span><p>{displayText}</p></span>;
};

export default TypingAnimation;
