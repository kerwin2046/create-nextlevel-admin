import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { apiRoutes } from './routes/index.js';
import { errorHandler } from './middleware/error.js';

const app: Express = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoutes);
app.use(errorHandler);

export default app;
