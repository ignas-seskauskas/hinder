import React, { useEffect, useState } from "react";
import UserFriend from "../../interfaces/Friend";
import { getAuthData } from "../../utils/getAuthData";
import authorizedFetch from "../../utils/authorizedFetch";
import { Button, Modal, Table } from "react-bootstrap";
import { BASE_API_URL } from "../../constants/api";
import { User } from "../../interfaces/User";

const Friendsview = () => {
  
  const URL = BASE_API_URL + "/friends";
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<boolean>(false);
  const [showRecommended, setShowRecommended] = useState<boolean>(false);
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const authData = getAuthData();

  const chooseDelete = (friend: any) => {
    setSelectedFriend(friend);
    setShowModal(true);
    setToDelete(true);
  };

  const handleModalHide = () => {
    setShowModal(false);
    setSelectedFriend(null);
    setToDelete(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await authorizedFetch(URL);
        setFriendsList(data.result);
        console.log(data.result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const deleteFriend = () => {
    if (selectedFriend) {
      const finalURL = URL + "/" + selectedFriend.id.toString();
      authorizedFetch(finalURL, {
        method: "delete",
      }).then((response) => {
        console.log(response);
        if(response)
        {
          const updatedList = friendsList.filter(
            (friend) => friend.newFriend.id !== selectedFriend.id
          );
          setFriendsList(updatedList);
          handleModalHide();
        }
        return response;
      });
    }
  };

  
  const generateRecommended = async() => {
    try{
      const data = await authorizedFetch(URL + "/recommended");
      //console.log(data);
      setRecommended(data.recommendedUsers);
      setShowRecommended(true);
    }
    catch(error){
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Friends View</h2>
      {showRecommended && recommended ? (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          
            <tr>
              <td>
                {recommended.name}
              </td>
              <td>
                {recommended.surname}
              </td>
              <td>
                <Button>
                    Add
                </Button>
                <Button variant="danger">
                    Decline
                </Button>
              </td>
            </tr>
          
        </tbody>
      </Table>
      ) : 
      !recommended ? (
        <p>No more Users left</p>
      ):(
        <Button onClick={generateRecommended}>
          Get recommendation
        </Button>
      )

      }
      {friendsList ? (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Friend Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {friendsList.map((friend) => (
            <tr key={friend.newFriend.id}>
              <td>
                {friend.newFriend.name}
              </td>
              <td>
                <Button
                    variant="danger"
                    onClick={() => chooseDelete(friend.newFriend)}
                  >
                    Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      ) : (
        <p>No friends to display.</p>
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleModalHide}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove the friend:{" "}
          {selectedFriend?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalHide}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteFriend}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Friendsview;