import React, { useState } from 'react';
import "../../index.css";
import Add from "../img/add.png";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [avatar, setAvatar] = useState(Add);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const avatarLink = URL.createObjectURL(file);
      setAvatar(avatarLink);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const displayName = e.target[0].value.trim();
    const email = e.target[1].value.trim().toLowerCase();
    const password = e.target[2].value.trim();
    const file = e.target[3].files[0];

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const storageRef = ref(storage, `avatars/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          setLoading(false);
          toast.error('Error uploading avatar. Please try again.');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, {
            displayName: displayName,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: user.displayName,
            avatar: user.photoURL,
            email: user.email,
          });

          await setDoc(doc(db, "userchats", user.uid), {});

          navigate("/");
          setLoading(false);
          toast.success("Account created successfully!");
        }
      );
    } catch (error) {
      setLoading(false);
      let errorMessage;

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use. Please choose another one.';
          break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again.';
      }

      toast.error(errorMessage);
    }
  };

  document.title = "Register to Chat App";

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat App</span>
        <span className="title">Register</span>
        <form onSubmit={handleRegister}>
          <input required type="text" placeholder="Name" />
          <input required type="email" placeholder="Email" />
          <input minLength={8} required type="password" placeholder="Password" />
          <label htmlFor="avatar">
            <img draggable="false" src={avatar} alt="Choose avatar" />
            <span>Add an avatar</span>
          </label>
          <input onChange={handleAvatar} accept="image/*" type="file" hidden name="avatar" id="avatar" />
          <button type="submit" disabled={loading} className={loading ? "disabledBtn" : ""}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
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
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;