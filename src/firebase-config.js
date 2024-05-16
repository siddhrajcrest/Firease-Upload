// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCcFO084ivgjty_CPMuTurgFk3bRqtBORA",
  authDomain: "tododemo-f5966.firebaseapp.com",
  databaseURL: "https://tododemo-f5966-default-rtdb.firebaseio.com",
  projectId: "tododemo-f5966",
  storageBucket: "tododemo-f5966.appspot.com",
  messagingSenderId: "890790857981",
  appId: "1:890790857981:web:720728043a366f68a50294",
  measurementId: "G-CM9ZTSJKPV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const storage = getStorage(app, "gs://tododemo-f5966.appspot.com");
