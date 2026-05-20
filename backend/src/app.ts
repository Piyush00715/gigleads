import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './utils/errors';
import apiRouter from './routes';

const app: Express = express();

// 📡 Connect to Database
connectDB();

// 🛡️ Security Headers
app.use(helmet());

// 🔀 CORS Setup
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie'],
  })
);

// 📦 Request Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 🚫 HTTP Parameter Pollution
app.use(hpp());

// 🚦 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs in dev/prod
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

if (env.NODE_ENV === 'production') {
  app.use('/api', limiter);
}

// 🗺️ API Routes
app.use('/api/v1', apiRouter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// ❓ 404 Route handler
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

// 💥 Global Error Middleware
app.use(errorHandler);

// 🚀 Start Listening
const PORT = env.PORT;
if (env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app;
