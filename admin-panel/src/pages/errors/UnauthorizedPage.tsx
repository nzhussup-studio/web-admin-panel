import Header from "@/components/layout/Header";

interface UnauthorizedPageProps {
  showHeader?: boolean;
}

const UnauthorizedPage = ({ showHeader = true }: UnauthorizedPageProps) => {
  return (
    <>
      {showHeader ? (
        <Header
          text='Unauthorized'
          showClearCacheButton={false}
          authActionLabel='Login'
        />
      ) : null}
      <div className='container my-5'>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>403 - Unauthorized</h1>
          <p>Your account does not have administrator access to this panel.</p>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
