//chat screen
import react, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import { ChatEngine, sendMessage } from "react-chat-engine";
import { auth, firestore } from "../fireBase";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import "../css/./style.css";
import settings from "../icon/settings.gif";

const Chats = () => {
  //getting user from the authContext provider which stores users are values
  const { user } = useAuth();

  //using history to manage route
  const history = useHistory();
  //setting loading state

  const [userID, setUserID] = useState("");
  const [id, setId] = useState();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const [userExisting, setUserExisting] = useState(true);
  console.log("userexisting in ", userExisting);

  //to get files/images
  const getFiles = async (url) => {
    const result = await fetch(url);
    const data = await result.blob(); /*converting the result to binary */
    return data;
    console.log(data);
  };

  useEffect(() => {
    //if no user, example when a user logs out, return to home page
    if (!user) {
      history.push("/");
      return;
    } else {
      //get username needed for chap enging initialization
      getUsername();
      // if user, make get the user from chat engine and set loading false
      if (username) {
        getChatEngineUser();
        askPermission();
        if (!userExisting) {
          createUser();
        }
      }
    }
  }, [user, username, userExisting, loading, history]);

  //function to get the username to use in chatengine calls.
  //auth by facebook and google do not provide username name
  //so when auth is from facebook or google, use display name as username
  const getUsername = async () => {
    if (user.displayName) {
      //from either google or facebook
      setUsername(user.displayName);
    } else {
      //auth is from password. Get username from the database
      const userDocument = await firestore.doc(`users/${user.uid}`).get();
      if (userDocument.exists) {
        const userName = userDocument.data().data.username;

        console.log("userName1..", userName, userDocument.data());

        setUsername(userName);
      }
    }

    console.log("username2...", username);
  };

  //handling loging out
  const handleSignout = async () => {
    history.push("/");
    await auth.signOut();
  };

  //get chat engine user
  //if user is not existing in chatengine, call the function that will create the user
  const getChatEngineUser = async () => {
    console.log("searching...");
    axios
      .get(`https://api.chatengine.io/users/`, {
        headers: {
          "private-key": process.env.REACT_APP_LETS_CHAT_ENGINE_KEY,
        },
      })
      .then((res) => {
        const found = res.data.find((data) => data.username === username);
        console.log("found is ", found);
        if (!found) {
          setUserExisting(false);
        }
        setUserExisting(true);
        setLoading(false);
      });
  };

  //create a user in chat engine
  const createUser = async () => {
    console.log("no userexisting", userExisting);

    let formdata = new FormData();
    formdata.append("email", user.email);
    formdata.append("username", username);
    formdata.append("secret", user.uid);
    getFiles(user.photoURL) //calling getfile function to get the file image of the user
      .then((profileImage) => {
        formdata.append("Avatar", profileImage, profileImage.name);

        axios
          .post("https://api.chatengine.io/users/", formdata, {
            headers: {
              "private-key": process.env.REACT_APP_LETS_CHAT_ENGINE_KEY,
            },
          })
          .then(() => {
            setUserExisting(true);
            setLoading(false);
            getChatEngineUser();
          })
          .catch((error) => console.log(error));
      });
  };
  //asking permision for notification
  const askPermission = async () => {
    console.log("permision request");
    return await Notification.requestPermission().then((response) => {
      if (response === "granted") notificationHandler();
      console.log("permission granted");
    });
  };

  //function to check if there is service worker in the browser
  //performs subscription action if there is
  const notificationHandler = () => {
    console.log("initialising push");
    if ("serviceWorker" in navigator) {
      sendSubscription().catch((err) => console.log(err));
    } else {
      alert(
        "This web browser does not support notification. Hence you wont be able to receive notification on new messages"
      );
    }
  };
  //Register Service worker (SW), Register Push, send notification
  async function sendSubscription() {
    console.log("registering SW");
    //Register SW
    const register = await navigator.serviceWorker
      .register("/worker.js", {
        scope: "/",
      })
      .then(function (register) {
        console.log("worked", register);
      })
      .catch(function (err) {
        console.log("error");
      });
    console.log("SW registered");

    //Register Push
    console.log("Registering Push");
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      console.log("ready");
      serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.REACT_APP_publicVapidKey
        ),
      });
    });
  }

  //fuction to convert the Vapid keys for push notification action from base64 string to a Uint8Array to pass into the subscribe call
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const sendPush = (sender) => {
    console.log(sender);
    if (sender !== username)
      navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
        console.log(serviceWorkerRegistration.pushManager.getSubscription());
        serviceWorkerRegistration.pushManager
          .getSubscription()
          .then((subscription) => {
            const message = `new message from ${username}`;
            console.log(message);
            const push = [subscription, message];
            console.log(push);
            fetch(`${process.env.REACT_APP_PUSH_URL}`, {
              method: "POST",
              body: JSON.stringify(push),
              headers: {
                "content-type": "application/json",
              },
            });
          });
      });

    console.log("push sent");
  };
  const editUser = () => {
    history.push("/editUser");
  };

  //if no user, retun loading

  return (
    <div className="chatPage">
      <div className="navBar">
        <div className="logoTab"> Lets Gist</div>
        <div className="displayName">{username}</div>
        <div className="rightTab">
          <div onClick={editUser}>
            <img className="settings" src={settings} />
          </div>
          <div className="signOut" onClick={handleSignout}>
            Sign Out
          </div>
        </div>
      </div>
      {username && !loading && userExisting ? (
        <ChatEngine
          height="calc(100vh - 66px)"
          projectID={process.env.REACT_APP_LETS_CHAT_ENGINE_ID}
          userName={username}
          userSecret={user.uid}
          onNewMessage={(chatId, message) => sendPush(message.sender.username)}
        />
      ) : (
        <div>Loading..........</div>
      )}
    </div>
  );
};

export default Chats;
