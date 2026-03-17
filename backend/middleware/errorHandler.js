export const notFound = (req, res, next) => {
  res.status(404);
  res.json({ error: `Route ${req.originalUrl} not found` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(res.statusCode === 200 ? 500 : res.statusCode);
  res.json({ error: err.message || "An unexpected error occurred" });
};
