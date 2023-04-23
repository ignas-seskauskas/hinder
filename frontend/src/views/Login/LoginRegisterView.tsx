import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginRegisterView = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div>
      <h2>Welcome page</h2>
      <button onClick={handleLoginClick} type="button">Login</button>
      <br />
      <button onClick={handleRegisterClick} type="button">Register</button>
    </div>
  );
};

export default LoginRegisterView;
