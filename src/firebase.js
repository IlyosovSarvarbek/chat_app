import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHuAD-yT9jKxr_wFQeM3Y0mVZBeJt6pvw",
  authDomain: "chat-app-b76a1.firebaseapp.com",
  projectId: "chat-app-b76a1",
  storageBucket: "chat-app-b76a1.appspot.com",
  messagingSenderId: "243303666741",
  appId: "1:243303666741:web:ea408e7912e1856c63cd7c"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();