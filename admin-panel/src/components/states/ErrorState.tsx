import InternalServerErrorState from "@/components/states/InternalServerErrorState";
import NotFoundPage from "@/pages/errors/NotFoundPage";

const ErrorState = ({
  status,
  response,
}: {
  status?: number;
  response?: string;
}) => {
  if (status === 404) {
    return <NotFoundPage />;
  }

  return <InternalServerErrorState description={response} />;
};

export default ErrorState;
