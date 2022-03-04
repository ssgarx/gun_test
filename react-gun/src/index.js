import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
ReactDOM.render(
  <React.StrictMode>
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);
