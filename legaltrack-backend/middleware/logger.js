// Logger middleware - runs on every request and prints details to the console
const logger = (req, res, next) => {
  const start = Date.now();

  // Listen for when the response is finished, then log the details
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );
  });

  // Pass control to the next middleware or route handler
  next();
};

module.exports = logger;