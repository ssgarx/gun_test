import React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

function Register({ g, u, k }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleClick = () => {
    u.create(userName, password, (ack) => {
      if (ack.err) {
        return alert(ack.err);
      }
      alert("Registered successfully! Please Login.");
      history.push("/login");
    });
  };

  return (
    <div>
      <h1>Register</h1>
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
      <button onClick={handleClick}>Create User</button>
      <p>
        Already registered? <Link to="/login">Login</Link>.
      </p>
    </div>
  );
}

export default Register;
