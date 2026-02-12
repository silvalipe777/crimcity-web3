import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from './config/env';
import { generalLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import playerRoutes from './routes/player.routes';
import robberyRoutes from './routes/robbery.routes';
import nightlifeRoutes from './routes/nightlife.routes';
import hospitalRoutes from './routes/hospital.routes';
import prisonRoutes from './routes/prison.routes';
import rankingRoutes from './routes/ranking.routes';

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(generalLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/player', playerRoutes);
app.use('/api/v1/robbery', robberyRoutes);
app.use('/api/v1/nightlife', nightlifeRoutes);
app.use('/api/v1/hospital', hospitalRoutes);
app.use('/api/v1/prison', prisonRoutes);
app.use('/api/v1/ranking', rankingRoutes);

// Error handler
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('join_room', (playerId: string) => {
    socket.join(`player:${playerId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
  });
});

// Export io for use in services
export { io };

// Start server
const PORT = parseInt(env.PORT);
httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║       CrimCity Web3 Backend           ║
  ║       Running on port ${PORT}            ║
  ║       Environment: ${env.NODE_ENV}    ║
  ╚═══════════════════════════════════════╝
  `);
});
