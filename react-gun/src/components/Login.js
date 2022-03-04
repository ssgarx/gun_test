import { SEA } from "gun";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

function Login({ g, u, k, user_teams }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState([]);
  const history = useHistory();

  useEffect(() => {
    setTeams(user_teams);
  }, [user_teams]);

  const handleClick = () => {
    u.auth(userName, password, (ack) => {
      if (ack.err) {
        return alert(ack.err);
      }
      alert("Logged in successfully");
      history.push("/Home");
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleClick}>Login</button>
      <p>
        Have'nt registered? <Link to="/register">Register</Link>.{" "}
      </p>
    </div>
  );
}

export default Login;
