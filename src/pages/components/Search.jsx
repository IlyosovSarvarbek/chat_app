import React, { useContext, useState } from 'react';
import userImg from "../../img/user.png";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from "../../firebase";
import { AuthContext } from "./../../AuthContext";

const Search = () => {
  const { currentUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);

  const handleSearchChange = async (e) => {
    const input = e.target.value;
    setUsername(input);

    if (!input) {
      setUsers([]);
      setErr(false);
      return;
    }

    const q = query(collection(db, "users"), where("displayName", "==", input));

    try {
      const querySnapshot = await getDocs(q);
      const matchedUsers = [];
      querySnapshot.forEach((doc) => {
        matchedUsers.push(doc.data());
      });

      if (matchedUsers.length > 0) {
        setUsers(matchedUsers);
        setErr(false);
      } else {
        setUsers([]);
        setErr(true);
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
      setErr(true);
    }
  };

  const handleSelect = async (selectedUser) => {
    const combinedId = currentUser.uid > selectedUser.uid
      ? currentUser.uid + selectedUser.uid
      : selectedUser.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userchats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            avatar: selectedUser.avatar,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userchats", selectedUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            avatar: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error creating chat: ", error);
    }
    setUsers([]);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          value={username}
          onChange={handleSearchChange}
          placeholder="Search user"
        />
      </div>

      {users.length > 0 ? (
        users.map((user, index) => (
          <div className="userChat foundChat" key={index} onClick={() => handleSelect(user)}>
            <img draggable="false" src={user.avatar || userImg} alt="user" />
            <div className="userChatIn">
              <span>{user.displayName}</span>
            </div>
          </div>
        ))
      ) : err && username ? (
        <span className='NoFound'>No users found!</span>
      ) : null}
    </div>
  );
};

export default Search;