import react from "react";
import ReactDOM from "react-dom";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import "../css/./lets-chat.css";
import image from "../icon/homepage.jpg";
import firebase from "firebase";
import { auth } from "../fireBase";
const LoginScreen = () => {
  return (
    <div className="loginScreen">
      <div className="title">
        <h1>Lets-Chat</h1>
      </div>
      <div className="outerContainer">
        <div className="image">
          <img src={image} alt="homepage icon" className="loginImage" />
        </div>
        <div className="loginCard">
          <h2>Hello! Welcome to Lets-Chat</h2>
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
