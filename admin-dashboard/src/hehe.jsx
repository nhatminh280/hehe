import LoginPage from "./page/loginPage";
import React from "react";
import { Link } from "react-router-dom";

const hehe = () => {
  return (
    <Link to="login">
      <LoginPage />
    </Link>
  );
};

export default hehe;
