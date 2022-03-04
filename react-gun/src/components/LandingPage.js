import React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Register from "./Register";

function LandingPage({ u }) {
  const history = useHistory();
  useEffect(() => {
    u?.is && history.push("/home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Register />;
}

export default LandingPage;
