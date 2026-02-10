import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import cors from "cors";
import { AppDataSource } from "@config/data-source";
import helmet from "helmet";
import apiRouter from "@routes/index";
import { errorHandler } from "@middlewares/handler";
import { env } from "@config/env";
import cookieParser from "cookie-parser";

AppDataSource.initialize();

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: env.CORS_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    https: env.USE_HTTPS,
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Shop QR Verification System.');
});

// Mount all routes under /api
app.use("/api", apiRouter);

// Error handler MUST be last!
app.use(errorHandler);

// ✅ SERVER SETUP WITH HTTPS TOGGLE
const PORT = Number(env.PORT) || 8000;
let server: http.Server | https.Server;

if (env.USE_HTTPS) {
  // 🔒 HTTPS MODE
  try {
    const certPath = path.join(__dirname, '../certs/cert.pem');
    const keyPath = path.join(__dirname, '../certs/key.pem');

    // Check if certificates exist
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      console.error('❌ SSL certificates not found!');
      console.error('Run: mkcert -key-file certs/key.pem -cert-file certs/cert.pem 192.168.110.55 localhost');
      process.exit(1);
    }

    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    server = https.createServer(httpsOptions, app);
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🔒 HTTPS Server running on https://192.168.110.55:${PORT}`);
      console.log(`🔒 Also available at https://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start HTTPS server:', error);
    process.exit(1);
  }
} else {
  // 🌐 HTTP MODE
  server = http.createServer(app);
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 HTTP Server running on http://192.168.110.55:${PORT}`);
    console.log(`🌐 Also available at http://localhost:${PORT}`);
  });
}

// ⭐ GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');

  server.close(async () => {
    console.log('HTTP/HTTPS server closed');

    try {
      await AppDataSource.destroy();
      console.log('Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
});