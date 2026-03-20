import { NotFoundIcon } from "@/assets/icons";
import Header from "@/components/layout/Header";

interface NotFoundPageProps {
  showHeader?: boolean;
}

const NotFoundPage = ({ showHeader = true }: NotFoundPageProps) => {
  return (
    <>
      {showHeader ? (
        <Header
          showClearCacheButton={false}
          titleContent={<NotFoundIcon width={36} height={36} aria-label='Page not found' />}
        />
      ) : null}
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
