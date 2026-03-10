import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDBKoCBwj5pnUvqF8X6P4WJ3mDWjQ3TEvk",
    authDomain: "travelling-174c0.firebaseapp.com",
    databaseURL: "https://travelling-174c0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "travelling-174c0",
    storageBucket: "travelling-174c0.firebasestorage.app",
    messagingSenderId: "938941787285",
    appId: "1:938941787285:web:903260047df404a5a4bf9c",
    measurementId: "G-KJEZ55W2VM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const storage = getStorage(app);

export { app, analytics, storage };
