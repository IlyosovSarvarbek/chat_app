import React, { useContext, useEffect, useState } from 'react';
import userImg from "../../img/user.png";
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../../AuthContext';
import { db } from '../../firebase';
import { ChatContext } from '../../ChatContext';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userchats", currentUser.uid), (doc) => {
        const data = doc.data();
        console.log(data); // Log the fetched data for debugging
        setChats(data ? Object.entries(data) : []);
      });
    
      return () => {
        unsub();
      };
    };
    
    if (currentUser?.uid) {
      getChats();
    }
  }, [currentUser.uid]);

  const handleSelect = (user) => {
    if (user) {
      dispatch({ type: "CHANGE_USER", payload: user });
    }
  };



  return (
    <div className='chats' id='chats'>
      {chats.length > 0 ? (
        chats.map((chat, index) => (
          <div className="userChat" key={index} onClick={() => handleSelect(chat[1]?.userInfo)}>
            <img draggable="false" src={chat[1]?.userInfo?.avatar || userImg} alt="user" />
            <div className="userChatIn">
              <span>{chat[1]?.userInfo?.displayName || "User"}</span>
            </div>
          </div>
        ))
      ) : (
        <p className='noChats'>You don't have any chats yet!</p>
      )}
    </div>
  );
};

export default Chats;