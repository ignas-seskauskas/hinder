import Spinner from "react-bootstrap/Spinner";

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center">
    <Spinner animation="border" role="status"></Spinner>
  </div>
);

export default LoadingSpinner;
