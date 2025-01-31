import React, { useContext } from 'react';
import cam from "../../img/cam.png";
import more from "../../img/more.png";
import userImg from "../../img/user.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from '../../ChatContext';

const Chat = () => {
  const { state, dispatch } = useContext(ChatContext);
  const user = state.user || {};

  const handleBackClick = () => {
    dispatch({ type: "CLOSE_CHAT" });
  };

  document.title = "Chats | Chat App"

  return (
    <div className="chat" id='chat'>
      {user.displayName ? (
        <>
          <div className="chatInfo">
            <div className="chatInfo-1">
              <img
                src="https://cdn-icons-png.flaticon.com/512/566/566002.png"
                draggable="false"
                id='back'
                alt="Back"
                onClick={handleBackClick} // Add click handler
              />
              <img className='userIcon' draggable="false" src={user.avatar || userImg} alt="user" />
              <span>{user.displayName || "No Name"}</span>
            </div>
            <div className="chatIcons">
              <img draggable="false" src={cam} alt="" />
              <img draggable="false" src={more} alt="" />
            </div>
          </div>
          <Messages />
          <Input />
        </>
      ) : (
        <div className="noChatMessage">
          <p>Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default Chat;