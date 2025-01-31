import React, { useState } from 'react';
import "../../index.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target[0].value.trim().toLowerCase();
    const password = e.target[1].value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      
      // Log the error object to check its structure
      console.error("Login error object:", error);

      let errorMessage;

      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'User not found or password may be incorrect.';
          break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again later.';
      }

      toast.error(errorMessage);
    }
  };

  document.title = "Sign in to Chat App";

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat App</span>
        <span className="title">Login</span>
        <form onSubmit={handleLogin}>
          <input required type="email" placeholder="Email" />
          <input minLength={8} required type="password" placeholder="Password" />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
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
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;