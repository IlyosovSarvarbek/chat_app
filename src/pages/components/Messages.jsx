import React, { useEffect, useRef, useState, useContext } from 'react';
import Message from './Message';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from "./../../firebase";
import { ChatContext } from '../../ChatContext';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { state } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", state.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      }
    });
    
    return () => {
      unSub();
    };
  }, [state.chatId]);

  return (
    <div className="message">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;