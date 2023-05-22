import React, { useState } from "react";
import UserFriend from "../../interfaces/Friend";
import { getAuthData } from "../../utils/getAuthData";
import authorizedFetch from "../../utils/authorizedFetch";
import { Button, Modal, Table } from "react-bootstrap";
import { BASE_API_URL } from "../../constants/api";

const Friendsview = () => {
  
  const URL = BASE_API_URL + "/friends";
  const [friendsList, setFriendsList] = useState<UserFriend[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<boolean>(false);
  const [selectedFriend, setSelectedFriend] = useState<UserFriend | null>(null);
  const authData = getAuthData();

  const chooseDelete = (friend: UserFriend) => {
    setSelectedFriend(friend);
    setShowModal(true);
    setToDelete(true);
  };

  const handleModalHide = () => {
    setShowModal(false);
    setSelectedFriend(null);
    setToDelete(false);
  };

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
            (friend) => friend.id !== selectedFriend.id
          );
          setFriendsList(updatedList);
          handleModalHide();
        }
        return response;
      });
    }
  };

  const fetchFriends = async () => {
    try {
      const data = await authorizedFetch(URL);
      setFriendsList(data.friends);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h2>Friends View</h2>
      <Button onClick={fetchFriends}>Fetch Friends</Button>
      {friendsList.length > 0 ? (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Friend Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {friendsList.map((friend) => (
            <tr key={friend.id}>
              <td>
                {authData?.id === friend.friend.id
                  ? friend.searcher.name
                  : friend.friend.name}
              </td>
              <td>
                <Button
                    variant="danger"
                    onClick={() => chooseDelete(friend)}
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
          {authData?.id == selectedFriend?.friend.id ? selectedFriend?.searcher.name : selectedFriend?.friend.name}?
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