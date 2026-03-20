import Spinner from "react-bootstrap/Spinner";

const LoadingState = ({
  title = "Loading",
  message = "Please wait...",
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <div className="py-5 text-center">
      <Spinner
        animation="border"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading</span>
      </Spinner>
      <div className="mt-4">
        <h2 className="h4 mb-2">{title}</h2>
        <p className="text-secondary mb-0">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
