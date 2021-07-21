//Registration Screen
import React, { useEffect, useState } from "react";
import {
  FacebookOutlined,
  GoogleOutlined,
  StrikethroughOutlined,
} from "@ant-design/icons";
import "../css/./style.css";
import firebase from "firebase";
import { auth, firestore } from "../fireBase";
import { useAuth } from "../contexts/authContext";
import { useHistory } from "react-router-dom";
import axios from "axios";
const CreateUser = () => {
  //getting user from the authContext provider which stores users are values
  const { user } = useAuth();

  //states to handle form inputs and error messages
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [errors, setErrors] = useState({});

  //using history to handle navigation
  const history = useHistory();
  useEffect(() => {
    //if user, it means login or creation of account is succesful, then navigate to chat screen
  }, [user]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (validate()) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          const newAuthUser = userCredential.user;
          console.log("new auth user", newAuthUser);
          if (newAuthUser) {
            createUserinDatabase(newAuthUser.uid);
          }

          // ...
        })
        .catch((error) => {
          const errorMessage = error.message;
          let autherror = { email: errorMessage };
          setErrors(autherror);
          console.log(errorMessage, "email adress already existing.");

          // ..
        });
    }
  };

  //validate registration form
  const validate = () => {
    let isValid = true;
    let errors = {};
    let minLength = 8;

    if (!username) {
      isValid = false;
      errors["username"] = "Please enter your name.";
    }

    if (!email) {
      isValid = false;
      errors["email"] = "Please enter your email Address.";
    }
    if (email !== "undefined") {
      const pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(email)) {
        isValid = false;
        errors["email"] = "Please enter valid email address..";
      }
    }
    if (!password) {
      isValid = false;
      errors["password"] = "Please enter your password.";
    }
    if (password !== "undefined") {
      const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
      );
      if (!strongRegex.test(password)) {
        errors["password"] =
          "password is weak. Must contain at least a number, capital  small letter; and up to eight characters.";
      }
    }
    if (!confirmPassword) {
      isValid = false;
      errors["confirmPassword"] = "Please enter your confirm password.";
    }
    if (password !== "undefined" && confirmPassword !== "undefined") {
      if (password != confirmPassword) {
        isValid = false;
        errors["password"] = "Passwords don't match.";
      }
    }
    setErrors(errors);
    return isValid;
  };
  //create user in database
  const createUserinDatabase = async (uid) => {
    const userRef = firestore.doc(`users/${uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      const data = { username: username, email: email, password: password };
      try {
        await userRef.set({ data });
      } catch (error) {
        console.log(error);
      }
    }
    return getUserDocument(uid);
  };
  const getUserDocument = async (uid) => {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    if (!userDocument.exists) {
      console.log("not existing");
    }
    console.log(userDocument.data());
    history.push("/chats");
    return userDocument.data();
  };
  //create a user in chat engine
  const createUserinChatengine = (secret) => {
    let formdata = new FormData();
    formdata.append("email", email);
    formdata.append("username", username);
    formdata.append("secret", user.uid);

    axios
      .post("https://api.chatengine.io/users/", formdata, {
        headers: {
          "private-key": process.env.REACT_APP_LETS_CHAT_ENGINE_KEY,
        },
      })
      .then(() => {})
      .catch((error) => console.log(error));
  };

  return (
    <div className="loginScreen">
      <div className="outerContainer">
        <div className="title">
          <h2>Lets-Gist</h2>
        </div>
        <div className="loginCard">
          <h5 className="registerDescription">
            Register your account and complete the rest of your profile on login
          </h5>

          <div className="content">
            <form>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="text-error">{errors.username}</div>
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="text-error">{errors.email}</div>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-error">{errors.password}</div>
              <input
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="text-error">{errors.confirmPassword}</div>
              <button className="login-btn" onClick={(e) => handleRegister(e)}>
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
