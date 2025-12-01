export const handleAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export const globalErrorHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (!err.isOperational) {
    console.error("ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Server side error",
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
