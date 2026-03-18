import PageTransition from "@/motion/PageTransition";

const LoadingState = ({
  title = "Loading",
  message = "Please wait...",
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <PageTransition>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <div
          className='spinner-border'
          role='status'
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className='sr-only'></span>
        </div>
        <h2 style={{ marginTop: "20px" }}>{title}</h2>
        <p>{message}</p>
      </div>
    </PageTransition>
  );
};

export default LoadingState;
