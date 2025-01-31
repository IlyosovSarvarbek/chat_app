import { createContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false after user is set
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="Loading">
        <img src="https://cdn.pixabay.com/animation/2023/05/02/04/29/04-29-06-428_512.gif"
         alt="Loading"
         draggable="false" />
      </div>
    ) 
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
