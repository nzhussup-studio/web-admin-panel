import PageWrapper from "../../../utils/SmoothPage";

const InternalServerError = ({ description }: { description?: string }) => {
  return (
    <PageWrapper>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>500 - Internal Server Error</h1>
        <p>{description}</p>
      </div>
    </PageWrapper>
  );
};

export default InternalServerError;
