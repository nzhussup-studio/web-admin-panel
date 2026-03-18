import PageTransition from "@/motion/PageTransition";

const EmptyState = ({ title = "No information found!" }: { title?: string }) => {
  return (
    <PageTransition>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>{title}</h1>
      </div>
    </PageTransition>
  );
};

export default EmptyState;
