import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { Hobby } from "../../interfaces/Hobby";

enum Place {
  Indoors = "Indoors",
  Outdoors = "Outdoors",
}

enum Type {
  Active = "Active",
  Passive = "Passive",
}

const HobbyListView = () => {
  const URL = "http://localhost:3000/hobbies";
  const [hobbyList, setHobbyList] = useState<Hobby[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<boolean>(false);
  const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);
  const emptyHobby: Hobby = {
    id: 0,
    name: "",
    type: "",
    place: "",
    attempts: 0,
    attemptDuration: 0,
  };
  const [newHobby, setNewHobby] = useState<Hobby>(emptyHobby);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to fetch hobbyList");
        }
        const jsonData: Hobby[] = await response.json();
        setHobbyList(jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleModalHide = () => {
    setShowModal(false);
    setSelectedHobby(null);
    setNewHobby(emptyHobby);
    setErrorMessage("");
    setToDelete(false);
  };

  const chooseHobbyDelete = (hobby: Hobby) => {
    setSelectedHobby(hobby);
    setShowModal(true);
    setToDelete(true);
  };

  const deleteHobby = () => {
    if (selectedHobby) {
      const finalURL = URL + "/" + selectedHobby.id.toString();
      fetch(finalURL, {
        method: "delete",
      }).then((response) => {
        console.log(response);
        if (response.ok) {
          const updatedList = hobbyList.filter(
            (hobby) => hobby.id !== selectedHobby.id
          );
          setHobbyList(updatedList);
          handleModalHide();
        }
        return response;
      });
    }
  };

  const chooseHobbyEdit = (hobby: Hobby) => {
    setSelectedHobby(hobby);
    setShowModal(true);
  };

  const editHobby = (e: SyntheticEvent) => {
    e.preventDefault();

    if (selectedHobby) {
      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedHobby),
      })
        .then((response) => {
          console.log(response);
          if (response.ok) {
            const updatedList = hobbyList.map((hobby) => {
              if (hobby.id === selectedHobby.id) {
                return selectedHobby;
              } else {
                return hobby;
              }
            });
            setHobbyList(updatedList);
            setShowModal(false);
            setSelectedHobby(null);
          }
          return response.json();
        })
        .then((data) => {
          setErrorMessage(data.error);
        });
    }
  };

  const createHobby = (e: SyntheticEvent) => {
    e.preventDefault();

    const newHobbyID = { ...newHobby, id: Date.now() };
    setNewHobby(emptyHobby);
    console.log(newHobbyID);

    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHobbyID),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          setHobbyList([...hobbyList, newHobbyID]);
          setShowModal(false);
        }
        return response.json();
      })
      .then((data) => {
        setErrorMessage(data.error);
      });
  };

  return (
    <div>
      <h3>Hobby list view</h3>
      <Button variant="success" onClick={() => setShowModal(true)}>
        Add hobby
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hobbyList.map((hobby) => (
            <tr key={hobby.id}>
              <td>{hobby.name}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => chooseHobbyEdit(hobby)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => chooseHobbyDelete(hobby)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleModalHide}>
        {toDelete && selectedHobby ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Delete Hobby</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              Are you sure you want to delete "{selectedHobby.name}" hobby?
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalHide}>
                Cancel
              </Button>
              <Button variant="danger" onClick={deleteHobby}>
                Delete
              </Button>
            </Modal.Footer>
          </>
        ) : selectedHobby ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Edit Hobby</Modal.Title>
              <Modal.Title className="ms-5 text-danger">
                {errorMessage}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={editHobby}>
                <Form.Label htmlFor="hobbyName">Name</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    id="hobbyName"
                    aria-describedby="basic-addon3"
                    value={selectedHobby.name}
                    onChange={(e) =>
                      setSelectedHobby({
                        ...selectedHobby,
                        name: e.target.value,
                      })
                    }
                  />
                </InputGroup>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    Type
                  </label>
                  <select
                    className="form-control"
                    value={selectedHobby.type}
                    onChange={(e) =>
                      setSelectedHobby({
                        ...selectedHobby,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Select an option --</option>
                    <option value={Type.Active}>{Type.Active}</option>
                    <option value={Type.Passive}>{Type.Passive}</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="place" className="form-label">
                    Place
                  </label>
                  <select
                    className="form-control"
                    value={selectedHobby.place}
                    onChange={(e) =>
                      setSelectedHobby({
                        ...selectedHobby,
                        place: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Select an option --</option>
                    <option value={Place.Outdoors}>{Place.Outdoors}</option>
                    <option value={Place.Indoors}>{Place.Indoors}</option>
                  </select>
                </div>
                <Form.Label htmlFor="attempts">Attempts</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    id="attempts"
                    aria-describedby="basic-addon3"
                    value={selectedHobby.attempts}
                    readOnly
                  />
                </InputGroup>
                <Form.Label htmlFor="attemptDuration">
                  Attempt duration
                </Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    id="attemptDuration"
                    aria-describedby="basic-addon3"
                    value={selectedHobby.attemptDuration}
                    readOnly
                  />
                </InputGroup>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalHide}>
                Cancel
              </Button>
              <Button variant="primary" onClick={editHobby}>
                Save Changes
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Add Hobby</Modal.Title>
              <Modal.Title className="ms-5 text-danger">
                {errorMessage}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={createHobby}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newHobby.name}
                    onChange={(e) => {
                      setNewHobby({ ...newHobby, name: e.target.value });
                    }}
                  />
                </Form.Group>
                <div>
                  <label htmlFor="type" className="form-label">
                    Type
                  </label>
                  <select
                    className="form-control"
                    value={newHobby.type}
                    onChange={(e) => {
                      setNewHobby({ ...newHobby, type: e.target.value });
                    }}
                  >
                    <option value="">-- Select an option --</option>
                    <option value={Type.Active}>{Type.Active}</option>
                    <option value={Type.Passive}>{Type.Passive}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="place" className="form-label">
                    Place
                  </label>
                  <select
                    className="form-control"
                    value={newHobby.place}
                    onChange={(e) => {
                      setNewHobby({ ...newHobby, place: e.target.value });
                    }}
                  >
                    <option value="">-- Select an option --</option>
                    <option value={Place.Outdoors}>{Place.Outdoors}</option>
                    <option value={Place.Indoors}>{Place.Indoors}</option>
                  </select>
                </div>
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalHide}>
                Cancel
              </Button>
              <Button variant="primary" onClick={createHobby}>
                Add New Hobby
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default HobbyListView;
