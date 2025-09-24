const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const venueRoutes = require('./routes/venue.routes');
const chatRoutes = require('./routes/chat.routes');

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/chat', chatRoutes);

// DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// SERVER & SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:19006',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO Logic
require('./sockets/socket')(io);

// TEST ROUTE
app.get('/', (req, res) => res.send('Delta App Backend API is running...'));

server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
