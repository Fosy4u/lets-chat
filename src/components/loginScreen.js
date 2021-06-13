//login screen
import React, { useEffect } from "react";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import "../css/./style.css";

import firebase from "firebase";
import { auth } from "../fireBase";
import { useAuth } from "../contexts/authContext";
import { useHistory } from "react-router-dom";
const LoginScreen = () => {
  //getting user from the authContext provider which stores users are values
  const { user } = useAuth();
  //using history to handle navigation
  const history = useHistory();
  useEffect(() => {
    //if user, it means login or creation of account is succesful, then navigate to chat screen
    if (user) {
      history.push("/chats");
    }
  }, [user]);
  return (
    <div className="loginScreen">
      <div className="outerContainer">
        <div className="title">
          <h1>Lets-Gist</h1>
        </div>
        <div className="loginCard">
          <h2>Hello! Welcome to Lets-Gist</h2>
          <div
            className="loginButton google"
            onClick={() =>
              auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
            }
          >
            <GoogleOutlined /> Sign in with Google
          </div>
          <br />
          <br />
          <div
            className="loginButton facebook"
            onClick={() =>
              auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider())
            }
          >
            <FacebookOutlined /> Sign in with Facebook
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
