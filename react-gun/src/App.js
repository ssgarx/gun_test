import Gun from "gun";
import "gun/sea";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import LandingPage from "./components/LandingPage";

const gun = Gun({
  peers: ["http:localhost:1000/gun"], // Put the relay node that you want here
});

//secret key used as salt for encryption
const salt = "secretKey";
const user = gun.user().recall({ sessionStorage: true });

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LandingPage g={gun} u={user} k={salt} />
        </Route>
        <Route path="/login">
          <Login g={gun} u={user} k={salt} />
        </Route>
        <Route path="/register">
          <Register g={gun} u={user} k={salt} />
        </Route>
        <Route path="/home">
          <Home g={gun} u={user} k={salt} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
