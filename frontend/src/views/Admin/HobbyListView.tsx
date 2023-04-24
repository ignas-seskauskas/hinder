import React, { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";

const HobbyListView = () => {
  const pathPrefix = "/hobby/";
  const hobbies = [
    { name: "Some hobby", path: "1" },
    { name: "Another hobby", path: "2" },
  ];
  hobbies.forEach((hobby) => {
    hobby.path = pathPrefix + hobby.path;
  });
  return (
    <div>
      <h2>Hobby list view</h2>
      <ListGroup>
        <ListGroup.Item className="fw-bold fs-5" variant="dark">
          Name
        </ListGroup.Item>
        {hobbies.map((hobby) => (
          <ListGroup.Item action as={Link} to={hobby.path} key={hobby.name}>
            {hobby.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default HobbyListView;
