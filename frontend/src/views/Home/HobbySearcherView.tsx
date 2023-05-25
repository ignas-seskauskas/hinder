import React, { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { BASE_API_URL } from "../../constants/api";
import authorizedFetch from "../../utils/authorizedFetch";
import { getAuthData } from "../../utils/getAuthData";
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";

const HobbySearcherView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible ] = React.useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    console.log(
      "Form submitted with username:",
      username,
      "and password:",
      password
    );
    navigate("/home");
  };

  // const createEventsForHobby = async (userId: number) => {
  //   return await authorizedFetch(`${BASE_API_URL}/createEventsForHobby`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       id: Number(userId),
  //     }),
  //   });
  // };

  const createEventsForHobby = async () => {
    setLoading(true);
    const authData = getAuthData();
    console.log(authData);
    if (authData) {
          const userId = authData.id;
          const response = await authorizedFetch(`${BASE_API_URL}/createEventsForHobby`, {
            method: "POST",
            body: JSON.stringify({
              id: Number(userId),
            }),
          });
          // if (response=="Success") {
          //     setIsAlertVisible(false);
          //     setTimeout(() => {setIsAlertVisible(true);}, 3000);
          // }
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2>Hobby searcher view</h2>
      <Button variant="success" onClick={createEventsForHobby}>
        Create Events
      </Button>
      <p hidden={isAlertVisible}> Success </p>
    </div>
  );
};

export default HobbySearcherView;
