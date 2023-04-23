import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HobbySearcherView = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      "Form submitted with username:",
      username,
      "and password:",
      password,
    );
    navigate("/home");
  };

  return (
    <div>
      <h2>Hobby searcher view</h2>
    </div>
  );
};

export default HobbySearcherView;
