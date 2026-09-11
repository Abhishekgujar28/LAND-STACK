import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { isSupabaseConfigured } from './config/supabase.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();

// Security & Parsing Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/prototype; configurable via env
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health Check Endpoint
const healthCheckHandler = (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Land Stack Express Backend',
    supabaseConnected: isSupabaseConfigured(),
    version: '1.0.0'
  });
};
app.get('/health', healthCheckHandler);
app.get('/api/v1/health', healthCheckHandler);

// API Routes
app.use('/api/v1', apiRoutes);

// Fallback for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      status: 404
    }
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Land Stack Backend Server Running`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Base API: http://localhost:${PORT}/api/v1`);
  console.log(`🩺 Health: http://localhost:${PORT}/health`);
  console.log(`📦 Supabase Status: ${isSupabaseConfigured() ? 'CONFIGURED' : 'USING FALLBACK STORE'}`);
  console.log(`=========================================`);
});

export default app;
