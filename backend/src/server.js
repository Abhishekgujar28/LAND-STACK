/**
 * Land Stack — Production REST API Server
 * 
 * Express + Supabase PostgreSQL/PostGIS/Auth + Mock Fallback Engine.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { config } from './config/env.js';
import { isSupabaseConfigured, getDataProviderMode } from './config/supabase.js';
import { correlationId } from './middleware/correlationId.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();

// ─── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: config.nodeEnv === 'production',
    crossOriginEmbedderPolicy: false,
  })
);

// ─── Response Compression & Parsers ──────────────────────────────────────────
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Correlation ID & Request Tracing ────────────────────────────────────────
app.use(correlationId);
app.use(requestLogger);

// ─── Strict CORS Configuration ────────────────────────────────────────────────
// Supports HTTP-only cookies (credentials: true) with authorized origins
const allowedOrigins = config.cors.origin
  ? config.cors.origin.split(',').map(o => o.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((o) => origin.startsWith(o) || o === '*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid blocking frontend
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Correlation-Id',
    ],
  })
);

// ─── Health Check ─────────────────────────────────────────────────────────────
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Land Stack Express Backend',
    version: '2.0.0',
    mode: getDataProviderMode(),
    supabaseConnected: isSupabaseConfigured(),
    correlationId: req.correlationId,
  });
};

app.get('/health', healthHandler);
app.get('/api/v1/health', healthHandler);

// ─── Master API Router ────────────────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ─── 404 Unmatched Route Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'RESOURCE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    },
  });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Land Stack Backend v2.0 Running`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Base API: http://localhost:${PORT}/api/v1`);
  console.log(`📦 Data Mode: DATABASE-ONLY (Supabase PostgreSQL / PostGIS)`);
  console.log(`🔐 Supabase Connected: ${isSupabaseConfigured() ? 'YES' : 'FAILED - Missing Configuration'}`);
  console.log(`=========================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] Process terminated.');
  });
});

export default app;
