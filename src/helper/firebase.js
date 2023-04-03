// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging/sw";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAmbCUHI44VLGK6xG7KAY8mn68paLTf8Ic",
    authDomain: "instagram-11374.firebaseapp.com",
    databaseURL: "https://instagram-11374-default-rtdb.firebaseio.com",
    projectId: "instagram-11374",
    storageBucket: "instagram-11374.appspot.com",
    messagingSenderId: "381736580675",
    appId: "1:381736580675:web:4ecd1e5aaa4f14dbbe06f6"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const authenticate = getAuth(app);
export const rtdb = getDatabase(app);
export const messaging = getMessaging(app);