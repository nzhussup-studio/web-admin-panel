import PageTransition from "@/motion/PageTransition";

const InternalServerErrorState = ({ description }: { description?: string }) => {
  return (
    <PageTransition>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>500 - Internal Server Error</h1>
        <p>{description}</p>
      </div>
    </PageTransition>
  );
};

export default InternalServerErrorState;
