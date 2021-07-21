//edit user
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../css/./style.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import picture from "../icon/avatar.jpg";
import Tilt from "react-tilt";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { doc, deleteDoc } from "firebase/firestore";
import firebase from "firebase";
import { auth, firestore } from "../fireBase";

const EditUser = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [username, setUsername] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [previewProfilePic, setPreviewProfilePic] = useState();
  const [id, setId] = useState();
  const [image, setImage] = useState(picture);
  useEffect(() => {
    getUsername();
    if (username) {
      getChatEngineUser();
    }
  }, [username]);
  const getUsername = async () => {
    const userDocument = await firestore.doc(`users/${user.uid}`).get();
    if (userDocument.exists) {
      const userName = userDocument.data().data.username;

      console.log("userName1..", userName, userDocument.data());

      setUsername(userName);
    }
  };
  const saveHandle = (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("first_name", firstName);
    formdata.append("last_name", lastName);
    if (profilePic) {
      formdata.append("avatar", profilePic, profilePic.name);
      axios
        .patch(`https://api.chatengine.io/users/${id}/`, formdata, {
          headers: {
            "private-key": process.env.REACT_APP_LETS_CHAT_ENGINE_KEY,
          },
        })
        .then((res) => {
          history.push("/chats");
        });
    }

    axios
      .patch(`https://api.chatengine.io/users/${id}/`, formdata, {
        headers: {
          "private-key": process.env.REACT_APP_LETS_CHAT_ENGINE_KEY,
        },
      })
      .then((res) => {
        history.push("/chats");
      });
  };
  //get chat engine user
  const getChatEngineUser = () => {
    axios
      .get(`https://api.chatengine.io/users/`, {
        headers: {
          "private-key": process.env.REACT_APP_LETS_CHAT_ENGINE_KEY,
        },
      })
      .then((res) => {
        res.data
          .filter((data) => data.username === username)
          .map((filteredData) => {
            setId(filteredData.id);
            setFirstName(filteredData.first_name);
            setLastName(filteredData.last_name);
            setImage(filteredData.avatar);
            console.log(filteredData);
            console.log("filter id", id);
          });
      });
  };
  const cancelHandler = (e) => {
    e.preventDefault();
    history.push("/chats");
  };
  const deleteHandler = (e) => {
    e.preventDefault();
    confirmAlert({
      title: "Confirm to delete account",
      message: "Do you really want to delete your account? .",
      buttons: [
        {
          label: "Yes",
          onClick: () => reAuthenticateAndDeleteUser(),
        },
        {
          label: "No",
          onClick: () => alert("Click No"),
        },
      ],
    });
  };
  const reAuthenticateAndDeleteUser = async () => {
    const authUser = firebase.auth().currentUser;
    const provider = authUser.providerData[0].providerId;
    console.log(provider);
    if (provider === "password") {
      const password = prompt(
        "To authorise this action, please type your password"
      );
      const credential = firebase.auth.EmailAuthProvider.credential(
        authUser.email,
        password
      );
      authUser
        .reauthenticateWithCredential(credential)
        .then(() => {
          console.log("user reauthenticated");
          deleteAction();
        })
        .catch((error) => {
          // An error ocurred
          alert("oops! delete action failed due to incorrect password");
        });
    }
    else if (provider==='google'){
      authUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then((userCredential) => {
        deleteAction()
      })
    }
     else if (provider === 'facebook'){
       authUser.reauthenticateWithPopup(new firebase.auth.FacebookAuthProvider()).then((userCredential) => {
        deleteAction()
      })
    }
  };

  const deleteAction = () => {
    //sign out user

    //delete user in chatengine
    axios
      .delete(`https://api.chatengine.io/users/${id}/`, {
        headers: {
          "private-key": process.env.REACT_APP_LETS_CHAT_ENGINE_KEY,
        },
      })
      .then(async (res) => {
        const userRef = firestore.doc(`users/${user.uid}`);
        const snapshot = await userRef.get();
        if (snapshot.exists) {
          try {
            //deleting user in firestore
            await userRef.delete().then(() => {
              //deleting firebase auth
              const authUser = firebase.auth().currentUser;
              authUser
                .delete()
                .then(() => {
                  console.log("Account deleted");
                  history.push("/");
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          } catch (error) {
            console.log(error);
          }
        }
      });
  };

  return (
    <div className="editPage">
      <div className="outerContainer">
        <div className="editTitle">
          <h1>Edit User Profile</h1>
        </div>

        <div className="loginCard">
          <div className="content">
            <Tilt>
              <img
                src={
                  previewProfilePic
                    ? previewProfilePic
                    : "https://s3-us-west-2.amazonaws.com/s.cdpn.io/221808/sky.jpg"
                }
                alt="profile picture"
              />
            </Tilt>
            <form>
              <label>First name: </label>
              <input
                defaultValue={firstName}
                type="text"
                placeholder={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
              <br></br>
              <label>Last name: </label>
              <input
                defaultValue={lastName}
                type="text"
                placeholder={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
              <br></br>
              <label>Profile picture: </label>
              <input
                type="file"
                placeholder="profile picture"
                onChange={(event) => {
                  setProfilePic(event.target.files[0]);
                  setPreviewProfilePic(
                    URL.createObjectURL(event.target.files[0])
                  );
                }}
              />
              <br></br>
              <div className="editButton">
                <button className=" pointer" onClick={saveHandle}>
                  Save
                </button>

                <button className=" pointer" onClick={cancelHandler}>
                  Cancel
                </button>
              </div>
              <div>
                <button className=" delete pointer" onClick={deleteHandler}>
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
