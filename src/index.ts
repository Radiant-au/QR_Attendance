import express from "express";
import cors from "cors";
import { AppDataSource } from "@config/data-source";
import helmet from "helmet";
import apiRouter from "@routes/index";
import { errorHandler } from "@middlewares/handler";
import { env } from "@config/env";

AppDataSource.initialize();

const app = express();
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
    origin: env.CORS_ORIGINS ? env.CORS_ORIGINS : [], // Allow only your React app in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,               // Allow cookies if you're using authentication
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// app.use('/', cors({}), express.static(path.join(__dirname, '../uploads')));

app.get('/', (req , res) => {
    res.send('Welcome to the Shop QR Verification System.');
});

// Mount all routes under /api
app.use("/api", apiRouter);

// Error handler MUST be last!
app.use(errorHandler);



const PORT = Number(env.PORT) || 5000;
const server = app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

// ⭐ GRACEFUL SHUTDOWN FOR CLOUD RUN
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    
    server.close(async () => {
        console.log('HTTP server closed');
        
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
