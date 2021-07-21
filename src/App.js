import react from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chats from "./components/chats";
import CreateUser from "./components/createUser";
import EditUser from "./components/edituser";
import HomePage from "./components/homepage";
import LoginScreen from "./components/loginScreen";

import { AuthProvider } from "./contexts/authContext";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/createUser" component={CreateUser} />
          <Route path="/chats" component={Chats} />
          <Route path="/editUser" component={EditUser} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
