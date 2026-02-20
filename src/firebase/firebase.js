import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOTmW9xUBnZexOCd9Vj24E5ZK3bDCVJKM",
  authDomain: "ai-comic-log-in.firebaseapp.com",
  projectId: "ai-comic-log-in",
  storageBucket: "ai-comic-log-in.firebasestorage.app",
  messagingSenderId: "450500310997",
  appId: "1:450500310997:web:969fcb764f2d8b21b42f5c",
  measurementId: "G-E715R7R97L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);