import express, { Express } from 'express';
import pinoHttp from 'pino-http';
import { MongoClient } from 'mongodb';
import { createHealthController } from './factory';
import { pinoInstance } from './adapters/PinoLogger';
import { Routes } from './routes';

export function createServer(client: MongoClient): Express {
  const app = express();
  app.use(express.json());
  app.use(pinoHttp({ logger: pinoInstance }));
  const healthController = createHealthController(client);
  app.get(Routes.Health, (req, res) => healthController.check(req, res));
  return app;
}
