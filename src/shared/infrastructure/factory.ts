import { MongoClient } from 'mongodb';
import { HealthRepository } from '../../health/domain/repositories/HealthRepository';
import { MongoHealthRepository } from '../../health/infrastructure/adapters/MongoHealthRepository';
import { HealthUseCase } from '../../health/application/HealthUseCase';
import { HealthController } from '../../health/infrastructure/http/HealthController';
import { Logger } from '../application/ports/Logger';
import { createPinoLogger } from './adapters/PinoLogger';

let healthRepository: HealthRepository;
let logger: Logger;

export function getLogger(): Logger {
  if (!logger) {
    logger = createPinoLogger();
  }
  return logger;
}

export async function connectToMongo(): Promise<MongoClient> {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is required');
  }
  return MongoClient.connect(mongoUri);
}

export function getHealthRepository(client: MongoClient): HealthRepository {
  if (!healthRepository) {
    healthRepository = new MongoHealthRepository(client.db());
  }
  return healthRepository;
}

export function createHealthUseCase(client: MongoClient): HealthUseCase {
  return new HealthUseCase(getHealthRepository(client));
}

export function createHealthController(client: MongoClient): HealthController {
  return new HealthController(createHealthUseCase(client), getLogger());
}

