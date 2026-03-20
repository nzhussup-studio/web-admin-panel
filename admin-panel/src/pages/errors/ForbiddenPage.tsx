import { ForbiddenIcon } from "@/assets/icons";
import Header from "@/components/layout/Header";

interface ForbiddenPageProps {
  showHeader?: boolean;
}

const ForbiddenPage = ({ showHeader = true }: ForbiddenPageProps) => {
  return (
    <>
      {showHeader ? (
        <Header
          showClearCacheButton={false}
          titleContent={<ForbiddenIcon width={36} height={36} aria-label='Forbidden' />}
        />
      ) : null}
      <div className='container my-5'>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>403 - Forbidden</h1>
          <p>Your account does not have administrator access to this panel.</p>
        </div>
      </div>
    </>
  );
};

export default ForbiddenPage;
