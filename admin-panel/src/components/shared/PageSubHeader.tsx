import type { ReactNode } from "react";
import BackArrow from "@/components/shared/BackButton";
import SortButton from "@/components/shared/SortButton";

interface PageSubHeaderProps {
  toggleSort: () => void;
  children?: ReactNode;
  showSort?: boolean;
}

const PageSubHeader = ({
  toggleSort,
  children,
  showSort = true,
}: PageSubHeaderProps) => {
  return (
    <div className='d-flex justify-content-between align-items-center w-100'>
      <div className='me-2'>
        <BackArrow />
      </div>

      {showSort ? (
        <>
          <div
            className='flex-grow-1 d-flex justify-content-center'
            style={{ gap: "10px" }}
          >
            {children}
          </div>

          <div className='ms-2'>
            <SortButton onSort={toggleSort} />
          </div>
        </>
      ) : (
        <div className='ms-auto d-flex align-items-center'>{children}</div>
      )}
    </div>
  );
};

export default PageSubHeader;
