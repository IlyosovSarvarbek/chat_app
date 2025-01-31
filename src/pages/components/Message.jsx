import React, { useEffect, useRef, useContext } from 'react';
import user from "../../img/user.png";
import { AuthContext } from '../../AuthContext';

const Message = ({ message }) => {
  const lastMessageRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const isOwnMessage = message.senderId === currentUser.uid;

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Handle message date formatting
  const formattedDate = message.date instanceof Object && message.date.toDate
    ? message.date.toDate().toLocaleString()  // If it's a Firestore Timestamp
    : new Date(message.date).toLocaleString(); // If it's already a JS Date or other format

  return (
    <div ref={lastMessageRef} className={`messageEl ${isOwnMessage ? 'own' : ''}`}>
      {!isOwnMessage && (
        <div className="messageInfo">
        </div>
      )}
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="attachment" />}
        <span>{formattedDate}</span> {/* Show formatted date */}
      </div>
    </div>
  );
};

export default Message;