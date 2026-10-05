import cors from 'cors';
import express from 'express';
import apiRouter from './routes/api.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use(apiRouter);

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof Error && error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
    return;
  }

  if (error instanceof Error && 'code' in error && error.code === 11000) {
    response.status(409).json({ error: 'A record with that value already exists' });
    return;
  }

  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
});

export default app;