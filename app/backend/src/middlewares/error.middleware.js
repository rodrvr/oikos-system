function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  const message = status === 500 ? "Error interno del servidor" : err.message;

  if (status === 500) {
    console.error("Internal error:", err.message);
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== "production" && { detail: err.message }),
  });
}

module.exports = errorMiddleware;
