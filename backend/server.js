import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { seedDatabase } from './utils/seed.js';
import authRoutes from './routes/authRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import letterRoutes from './routes/letterRoutes.js';
import userRoutes from './routes/userRoutes.js';
import agendaRoutes from './routes/agendaRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ADRDE Portal API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/agendas', agendaRoutes);
app.use('/api', userRoutes);

app.use(notFound);
app.use(errorHandler);

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (userId) socket.join(String(userId));
  });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB(process.env.MONGODB_URI);
      await seedDatabase();
    } else {
      console.warn('MONGODB_URI not set — API will fail on database routes');
    }
    server.listen(PORT, () => {
      console.log(`ADRDE API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
