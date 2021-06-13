import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase
  .initializeApp({
    apiKey: "AIzaSyBEMfxRVIZCbMwWwrBLR6ZZRFKTeam0FdM",
    authDomain: "lets-chat-f71ca.firebaseapp.com",
    projectId: "lets-chat-f71ca",
    storageBucket: "lets-chat-f71ca.appspot.com",
    messagingSenderId: "619754696349",
    appId: "1:619754696349:web:fa431ecfaf0dfde872ae74",
  })
  .auth();
