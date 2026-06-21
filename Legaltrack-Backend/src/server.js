require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('../models');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(require('./middleware/logger'));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/clients',   require('./routes/clients'));
app.use('/api/cases',     require('./routes/cases'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/settings',  require('./routes/settings'));
app.use('/api/ai',        require('./routes/ai'));
app.use('/api/notes', require('./routes/notes'));

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false, data: null,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found`, details: {} }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false, data: null,
    error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong', details: {} }
  });
});

// WebSocket
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible in routes
app.set('io', io);

// Sync DB and start server
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection failed:', err.message);
  });