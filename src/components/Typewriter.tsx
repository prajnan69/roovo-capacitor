"use client";

import { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({
  words,
  typingSpeed = 150,
  deletingSpeed = 100,
  pauseDuration = 1500,
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasCycledOnce, setHasCycledOnce] = useState(false);

  useEffect(() => {
    if (hasCycledOnce) return;

    const handleTyping = () => {
      const currentWord = words[wordIndex];
      const updatedText = isDeleting
        ? currentWord.substring(0, text.length - 1)
        : currentWord.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === currentWord) {
        // Pause at the end of the word
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && updatedText === '') {
        // Move to the next word
        setIsDeleting(false);
        const nextWordIndex = (wordIndex + 1);
        if (nextWordIndex === words.length) {
          setHasCycledOnce(true);
        } else {
          setWordIndex(nextWordIndex);
        }
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration, hasCycledOnce]);

  return (
    <span className="relative">
      {text}
      {/* Blinking Cursor */}
      <span className="animate-blink border-slate-300 ml-1"></span>
    </span>
  );
};

export default Typewriter;
