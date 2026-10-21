export function errorHandler(err, _req, res, _next) {
  // Avoid logging request validation details that may contain donor PII.
  console.error("API error", err.name || "Error", err.code || "");
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((item) => item.message).join(" ") });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Unable to register with the supplied details." });
  }
  res.status(err.statusCode || 500).json({
    message: err.statusCode && err.statusCode < 500 ? err.message : "Something went wrong",
  });
}
