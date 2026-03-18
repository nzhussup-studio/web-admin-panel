import InternalServerError from "./InternalServerError";
import NotFound from "./NotFound";

const ErrorElement = ({
  status,
  response,
}: {
  status?: number;
  response?: string;
}) => {
  if (status === 404) {
    return <NotFound />;
  }

  return <InternalServerError description={response} />;
};

export default ErrorElement;
