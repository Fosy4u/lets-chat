//chat screen
import react, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import { ChatEngine, sendMessage } from "react-chat-engine";
import { auth } from "../fireBase";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import "../css/./style.css";

const Chats = () => {
  //getting user from the authContext provider which stores users are values
  const { user } = useAuth();

  //using history to manage route
  const history = useHistory();
  //setting loading state
  const [loading, setloading] = useState(true);
  const [userID, setUserID] = useState("");

  //to get files/images
  const getFiles = async (url) => {
    const result = await fetch(url);
    const data = await result.blob(); /*converting the result to binary */
    return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
  };

  useEffect(() => {
    //if no user, example when a user logs out, return to home page
    if (!user) {
      history.push("/");
      return;
    }
    // if user, make get the user from chat engine and set loading false
    axios
      .get("https://api.chatengine.io/users/", {
        headers: {
          "project-id": process.env.REACT_APP_LETS_CHAT_ENGINE_ID,
          "user-name": user.displayName,
          "user-secret": user.uid,
        },
      })
      .then(() => {
        setloading(false);
      })
      //error in getting user means user does not exist in chat engine, therefore, create the user
      .catch(() => {
        let formdata = new FormData();
        formdata.append("email", user.email);
        formdata.append("username", user.displayName);
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
                setloading(false);
              })
              .catch((error) => console.log(error));
          });
      });
    askPermission();
  }, [user, history]);
  //handling loging out
  const handleSignout = async () => {
    await auth.signOut();
    history.push("/");
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
    if (sender !== user.displayName)
      navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
        console.log(serviceWorkerRegistration.pushManager.getSubscription());
        serviceWorkerRegistration.pushManager
          .getSubscription()
          .then((subscription) => {
            const message = `new message from ${user.displayName}`;
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
  //if no user, retun loading
  if (!user) return "loading....";
  return (
    <div className="chatPage">
      <div className="navBar">
        <div className="logoTab"> Lets Gist</div>
        <div className="signoutTab">
          <div onClick={notificationHandler}>{user.displayName}</div>
          <div onClick={handleSignout}>Sign Out</div>
        </div>
      </div>
      <pre>{process.env.React_APP_LETS_TALK_CHAT_ENGINE_ID}</pre>
      <ChatEngine
        height="calc(100vh - 66px"
        projectID={process.env.REACT_APP_LETS_CHAT_ENGINE_ID}
        userName={user.displayName}
        userSecret={user.uid}
        onNewMessage={(chatId, message) => sendPush(message.sender.username)}
      />
    </div>
  );
};

export default Chats;
