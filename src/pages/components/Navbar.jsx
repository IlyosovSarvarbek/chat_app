import React, { useContext } from 'react';
import user from "../../img/user.png";
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../../AuthContext';
import { ChatContext } from '../../ChatContext'; // Import ChatContext

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext); // Get dispatch from ChatContext

  const handleSignOut = () => {
    signOut(auth).then(() => {
      dispatch({ type: "RESET_CHAT" }); // Dispatch RESET_CHAT action after signing out
    }).catch(error => {
      console.error("Sign-out error: ", error);
    });
  };

  return (
    <div className="navbar">
      <div className="user">
        <div className="userInfo">
          <img draggable="false" src={currentUser.photoURL || user} alt="User avatar" />
          <span>{currentUser.displayName}</span>
        </div>
        <button onClick={handleSignOut}>Log out</button>
      </div>
    </div>
  );
}

export default Navbar;