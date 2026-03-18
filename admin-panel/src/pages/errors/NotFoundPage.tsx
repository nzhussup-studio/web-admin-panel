import Header from "@/components/layout/Header";

const NotFoundPage = () => {
  return (
    <>
      <Header text='Page Not Found' />
      <div className='container my-5'>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>404 - Page Not Found</h1>
          <p>The page you&apos;re looking for does not exist.</p>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
