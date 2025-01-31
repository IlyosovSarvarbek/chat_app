import React, { useContext, useState } from 'react';
import imgImg from "../../img/img.png";
import attach from "../../img/attach.png";
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { v4 as uuid } from 'uuid';
import { AuthContext } from '../../AuthContext';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ChatContext } from '../../ChatContext';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { state } = useContext(ChatContext);
  const [loading, setLoading] = useState(false); // For loading state

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imgUrl = null;

      if (img) {
        const storageRef = ref(storage, `images/${img.name + uuid()}`);
        await uploadBytes(storageRef, img);
        imgUrl = await getDownloadURL(storageRef);
      }

      const messageData = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        img: imgUrl || null, // Attach image URL if available
      };

      // Update Firestore with message data
      await updateDoc(doc(db, "chats", state.chatId), {
        messages: arrayUnion(messageData),
        lastMessage: {
          text: imgUrl ? "Image sent" : text, // Show "Image sent" for images
          senderId: currentUser.uid,
          date: Timestamp.now(),
        },
      });

      setText("");
      setImg(null);
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="input">
      <input
        autoComplete="off"
        onChange={(e) => setText(e.target.value)}
        type="text"
        name="message"
        id="message"
        placeholder="Type something..."
        value={text}
      />
      <div className="send">
        <img draggable="false" src={attach} alt="Attach media" />
        <input
          accept="image/*"
          type="file"
          id="file"
          hidden
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img draggable="false" src={imgImg} alt="Attach image" />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </form>
  );
};

export default Input;