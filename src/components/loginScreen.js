//login screen
import React, { useEffect, useState } from "react";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import "../css/./style.css";
import firebase from "firebase";
import { auth } from "../fireBase";
import { useAuth } from "../contexts/authContext";
import { useHistory, Link } from "react-router-dom";
const LoginScreen = () => {
  //getting user from the authContext provider which stores users are values
  const { user } = useAuth();
  //user state to store error, email and password for login
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  //using history to handle navigation
  const history = useHistory();
  useEffect(() => {
    //if user, it means login or creation of account is succesful, then navigate to chat screen
    if (user) {
      history.push("/chats");
    }
  }, [user]);

  //loging handler for username and email option
  const loginHandler = (event) => {
    console.log("about to sign in");
    event.preventDefault();
    console.log(email, password);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const signedUser = userCredential.user;
        console.log(signedUser);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setError("incorrect username or password");
      });
  };
  return (
    <div className="loginScreen">
      <div className="outerContainer">
        <div className="title">
          <h2>Lets-Gist</h2>
        </div>
        <div className="loginCard">
          <h3>Hello! Welcome to Lets-Gist</h3>
          <div className="loginOption">
            <div
              className="loginButton login-btn"
              onClick={() =>
                auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
              }
            >
              <GoogleOutlined />\
              <span className="loginText">Login with Google</span>
            </div>

            <div
              className="loginButton login-btn"
              onClick={() =>
                auth.signInWithRedirect(
                  new firebase.auth.FacebookAuthProvider()
                )
              }
            >
              <FacebookOutlined />
              <span className="loginText">Login with Facebook</span>
            </div>
          </div>
          <div>
            <h4>OR</h4>
          </div>
          <div className="content">
            <div className="text-error">{error}</div>
            <form>
              <input
                type="text"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="login-btn"
                onClick={(event) => {
                  loginHandler(event);
                }}
              >
                Login
              </button>
            </form>
            <div>
              <p>
                Not registered?
                <Link to={"/createUser"}>
                  <button className="signUp">Sign Up!</button>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
