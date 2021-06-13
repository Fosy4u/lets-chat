import react from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chats from "./components/chats";
import LoginScreen from "./components/loginScreen";

import { AuthProvider } from "./contexts/authContext";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={LoginScreen} />
          <Route path="/chats" component={Chats} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
