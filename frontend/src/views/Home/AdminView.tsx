import { Button } from "react-bootstrap";
import { BASE_API_URL } from "../../constants/api";
import { useNavigate } from "react-router-dom";

const AdminView = () => {
  // const URL = BASE_API_URL + "/hobbies";
  const navigate = useNavigate();

  const viewHobbies = () => {
      //if (!response.ok) {
      //  console.log(response);
      //  throw new Error("Failed to fetch hobbyList");
      //}
      // const jsonData: Hobby[] = await response.json();
      // setHobbyList(jsonData);
      // const resData = await response.json();

      navigate("/hobby/list");
  };

  return (
    <div>
      <h2>Admin view</h2>
      <Button variant="success" onClick={viewHobbies}>
        View hobbies
      </Button>
    </div>
  );
};

export default AdminView;
