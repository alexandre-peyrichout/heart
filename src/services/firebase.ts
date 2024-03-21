// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKRJYyGueEslKtUmWnXjMfp4mcHaKAqK4",
  authDomain: "heart-45ea3.firebaseapp.com",
  projectId: "heart-45ea3",
  storageBucket: "heart-45ea3.appspot.com",
  messagingSenderId: "633116863210",
  appId: "1:633116863210:web:171f9f2eb996a685c80593",
  measurementId: "G-CKP6JPYRJZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
