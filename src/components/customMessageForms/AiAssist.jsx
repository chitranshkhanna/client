import React, { useState, useEffect } from 'react';
import MessageFormUI from './MessageFormUI';
import { usePostAiAssistMutation } from '@/state/api';

function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
     const handler = setTimeout(() => {
        setDebounceValue(value);
     }, delay); 
     
     return () => {
        clearTimeout(handler);
     }
    } , [value, delay])

    return debounceValue;
}

const AiAssist = ({ props, activeChat}) => {
    const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState("");
  const [triggerAssist, resultAssist] = usePostAiAssistMutation();
  const [appendText, setAppendText] = useState("");
 

  const handleChange = (e) => setMessage(e.target.value);

  const handleSubmit = async () => {
    const date = new Date()
    .toISOString()
    .replace("T" , " ")
    .replace("Z", `${Math.floor(Math.random() * 1000)}+00.00`);
    
    const at = attachment ? [{ blob: attachment, file: attachment.name }] : [];
    const form = {
      attachments: at,
      created: date,
      sender_username: props.username,
      text: message,
      activeChatId: activeChat.id,
    };
   
   props.onSubmit(form);
   setMessage("");
   setAttachment("");
   };

   const debouncedValue = useDebounce(message, 1000);
   useEffect(() => {
    if (debouncedValue) {
        const form = { text: message};
        triggerAssist(form);
    }
   }, [debouncedValue]); // eslint-disable-line

    const handleKeyDown = (e) => {
        //handle enter and tab
        if (e.keycode ===9 || e.keycode === 13) {
            e.preventDefault();
            setMessage(`${message} ${appendText}` )
        }
        setAppendText("");
    }
    useEffect(() => {
        if (resultAssist.data?.text) {
            setAppendText(resultAssist.data?.text)
        }
    }, [resultAssist]); //eslint-disable-line

  return (
    <MessageFormUI
  setAttachment={setAttachment}
  message={message}
  handleChange={handleChange}
  handleSubmit={handleSubmit}
  appendText= {appendText}
  handleKeyDown={handleKeyDown}
    />
  );
};

export default AiAssist;