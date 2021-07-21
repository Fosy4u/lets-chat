//using React useContext to store user details and provide it to the rest of the component
import React, { useContext, useState, useEffect } from "react";

import { useHistory } from "react-router-dom";
import { auth } from "../fireBase";
import { react } from "@babel/types";
//creating React Context
const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [loading, setloading] = useState(true);
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    //watching change in authentication from firebase and capturing the user detail
    //setting loading to false if there is no user

    auth.onAuthStateChanged((user) => {
      setUser(user);
      setloading(false);
      if (user) {
      
      }
    });
  }, [user, history]);
  //setting the value to be provided to the whole component to equal the user
  const value = { user };
  return (
    <AuthContext.Provider value={value}>
      {
        //if not loading, provide the children with the value - user
        !loading && children
      }
    </AuthContext.Provider>
  );
};
