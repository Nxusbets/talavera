import express from 'express';
import dotenv from 'dotenv';
import knex from 'knex';
// @ts-ignore
import knexfile from '../knexfile.js';
import { createAuthRoutes } from './routes/auth.js';
import { createProjectRoutes } from './routes/projects.js';
import { createSubscriptionRoutes } from './routes/subscriptions.js';
import { PlanController } from './controllers/PlanController.js';
import { PlanRepository } from './repositories/PlanRepository.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Knex
const db = knex(knexfile.development);

// Enable CORS
app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', createAuthRoutes(db));
app.use('/api/projects', createProjectRoutes(db));

// Public Plans endpoint
const planRepository = new PlanRepository(db);
const planController = new PlanController(planRepository);
app.get('/api/plans', (req, res) => planController.list(req, res));

// Protected Subscriptions endpoints
app.use('/api/subscriptions', createSubscriptionRoutes(db));

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});

export default app;
