import React, { SyntheticEvent, useEffect, useState } from "react";
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Route } from "../../interfaces/Route";

const RouteListView = () => {
  const URL = "http://localhost:3000/routes";
  const pathPrefix = "/route/";
  const [data, setData] = useState<Route[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/routes");
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to fetch data");
        }
        const jsonData: Route[] = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  function handleClick(route: Route) {
    const path = pathPrefix + route.id;
    const action = "view";
    navigate(path, { state: { action: action, route: route } });
  }

  const openRouteCreation = (e: SyntheticEvent) => {
    e.preventDefault();
    const action = "create";
    const path = pathPrefix + action;
    navigate(path, { state: { action: action } });
  };

  return (
    <div>
      <h2>Route list view</h2>
      <Button variant="success" onClick={openRouteCreation}>
        Add route
      </Button>
      <ListGroup>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((route) => (
              <tr key={route.id}>
                <td>
                  <ListGroup.Item
                    action
                    onClick={() => handleClick(route)}
                    key={route.name}
                  >
                    {route.name}
                  </ListGroup.Item>
                </td>
                <td>
                  <Button variant="primary">Edit</Button>{" "}
                  <Button variant="danger">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ListGroup>
    </div>
  );
};

export default RouteListView;
