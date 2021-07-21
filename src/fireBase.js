//connecting the app to the firebase to handle authentication
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEMfxRVIZCbMwWwrBLR6ZZRFKTeam0FdM",
  authDomain: "lets-chat-f71ca.firebaseapp.com",
  projectId: "lets-chat-f71ca",
  storageBucket: "lets-chat-f71ca.appspot.com",
  messagingSenderId: "619754696349",
  appId: "1:619754696349:web:fa431ecfaf0dfde872ae74",
  databaseURL:
    "https://lets-chat-f71ca-default-rtdb.europe-west1.firebasedatabase.app",
};
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
