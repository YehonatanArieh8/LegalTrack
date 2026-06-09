// Main entry point for the LegalTrack backend server
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Import middleware
const logger = require('./middleware/logger');

// Import route handlers
const usersRoutes = require('./routes/users');
const clientsRoutes = require('./routes/clients');
const casesRoutes = require('./routes/cases');
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');

// Parse incoming JSON request bodies
app.use(express.json());

app.use(cors());

// Log every incoming request to the console
app.use(logger);

// Register routes
app.use('/api/users', usersRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

// Handle requests to unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      details: {}
    }
  });
});

// Global error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      details: {}
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`LegalTrack server running on http://localhost:${PORT}`);
});
