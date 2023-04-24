import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Hobby from "../../interfaces/Hobby";

const HobbyPage = () => {
  const { state } = useLocation();
  console.log(state);
  return (
    <div>
      <h2>Hobby view page</h2>
      <div>Name: {state.name}</div>
      <div>Type: {state.type}</div>
      <div>Place: {state.place}</div>
      <div>Attempts: {state.attempts}</div>
      <div>Attempt duration: {state.attemptDuration}</div>
    </div>
  );
};

export default HobbyPage;
