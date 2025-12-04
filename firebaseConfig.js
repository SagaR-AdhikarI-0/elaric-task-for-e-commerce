// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDONtKkqXuLsDbpFBziM7YkNBLEx-W1bd8",
    authDomain: "smallecommerceproject.firebaseapp.com",
    projectId: "smallecommerceproject",
    storageBucket: "smallecommerceproject.firebasestorage.app",
    messagingSenderId: "595997860064",
    appId: "1:595997860064:web:42ac36cfa89c21bf957085",
    measurementId: "G-G6434K5PQ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export { analytics, auth ,db};
