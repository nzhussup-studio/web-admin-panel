import PageTransition from "@/motion/PageTransition";

const NotFoundPage = () => {
  return (
    <PageTransition>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you&apos;re looking for does not exist.</p>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
