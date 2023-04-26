import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, Table, Modal, Form, InputGroup } from "react-bootstrap";
import Hobby from "../../interfaces/Hobby";

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
  };

  const handleDelete = (hobbyID: number) => {
    const finalURL = URL + "/" + hobbyID.toString();
    fetch(finalURL, {
      method: "delete",
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        const updatedList = hobbyList.filter((hobby) => hobby.id !== hobbyID);
        setHobbyList(updatedList);
      }
      return response;
    });
  };

  const handleEdit = (hobby: Hobby) => {
    setSelectedHobby(hobby);
    setShowModal(true);
  };

  const handleEditHobby = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowModal(false);

    if (selectedHobby) {
      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedHobby),
      }).then((response) => {
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
        }
        return response.json();
      });
    }

    setSelectedHobby(null);
  };

  const handleAddHobby = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowModal(false);

    const newHobbyID = { ...newHobby, id: Date.now() };
    setNewHobby(emptyHobby);
    console.log(newHobbyID);

    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHobbyID),
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        setHobbyList([...hobbyList, newHobbyID]);
      }
      return response.json();
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
                <Button variant="primary" onClick={() => handleEdit(hobby)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(hobby.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleModalHide}>
        {selectedHobby ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Edit Hobby</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={handleEditHobby}>
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
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleEditHobby}>
                Save Changes
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Add Hobby</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={handleAddHobby}>
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
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddHobby}>
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
