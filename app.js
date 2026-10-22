import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { env } from './config/envConfig.js';
import { connectDB, disconnectDB } from "./config/db.js";

// import connectDB from './db/mongodb.js';

import receiptRouter from './routes/receipts.route.js';
import userRouter from './routes/users.route.js';
import authRouter from './routes/auth.route.js';

// import arcjetMiddleware from './middleware/arcjet.middleware.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

// 1. Load Environment Variables FIRST
connectDB();

const app = express();

// 2. Logging Middleware
app.use(logger('dev'));

// 3. Body Parsing & Cookie Middleware (MUST come before routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(arcjetMiddleware); // Apply Arcjet middleware to all routes
// app.use(express.static(path.join(__dirname, 'public')));

// 4. Root / Health Check Route
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to Receipt generator API' });
});

// 5. API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/receipts', receiptRouter);

// 6. Global Error Handling Middleware (MUST be last after all routes)
app.use(notFound);
app.use(errorHandler);

// 7. Start Server & Connect to Database
const PORT = env.port;

const server = app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

export default app;