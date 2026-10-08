import Spinner from "react-bootstrap/Spinner";

const LoadingState = ({
  title = "Loading",
  message = "Please wait...",
  fullPage = false,
}: {
  title?: string;
  message?: string;
  fullPage?: boolean;
}) => {
  return (
    <section
      className={`loading-state ${fullPage ? "loading-state-page" : ""}`}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-state-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading</span>
        </Spinner>
      </div>
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </section>
  );
};

export default LoadingState;
