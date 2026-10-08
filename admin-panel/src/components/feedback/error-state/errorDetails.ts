interface ErrorDetails {
  title: string;
  description: string;
}

export const getErrorDetails = (status: number): ErrorDetails => {
  if (status === 403)
    return {
      title: "Access denied",
      description: "Your account does not have permission to view this page.",
    };
  if (status === 404)
    return {
      title: "Page not found",
      description: "The page may have moved, been removed, or never existed.",
    };
  if (status === 502)
    return {
      title: "Bad gateway",
      description:
        "A service returned an invalid response. Please try again shortly.",
    };
  if (status === 503)
    return {
      title: "Service unavailable",
      description:
        "The service is temporarily unavailable or under maintenance.",
    };
  if (status === 504)
    return {
      title: "Gateway timeout",
      description: "A service took too long to respond. Please try again.",
    };
  if (status >= 500)
    return {
      title: "Internal server error",
      description:
        "Something went wrong on the server. Your data has not been changed.",
    };
  return {
    title: "Something went wrong",
    description: "We could not complete this request.",
  };
};
