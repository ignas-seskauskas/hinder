import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Hobby from "../../interfaces/Hobby";

const HobbyListView = () => {
  const pathPrefix = "/hobby/";
  const [data, setData] = useState<Hobby[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/hobbies");
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to fetch data");
        }
        const jsonData: Hobby[] = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  function handleClick(hobby: Hobby) {
    const path = pathPrefix + hobby.id;
    navigate(path, { state: hobby });
  }

  return (
    <div>
      <h2>Hobby list view</h2>
      <ListGroup>
        <ListGroup.Item className="fw-bold fs-5" variant="dark">
          Name
        </ListGroup.Item>
        {data.map((hobby) => (
          <ListGroup.Item
            action
            onClick={() => handleClick(hobby)}
            key={hobby.name}
          >
            {hobby.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default HobbyListView;
