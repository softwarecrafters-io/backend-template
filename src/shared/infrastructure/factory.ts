import { MongoClient } from 'mongodb';
import { HealthRepository } from '../../health/domain/repositories/HealthRepository';
import { MongoHealthRepository } from '../../health/infrastructure/adapters/MongoHealthRepository';
import { HealthUseCase } from '../../health/application/HealthUseCase';
import { HealthController } from '../../health/infrastructure/http/HealthController';
import { Logger } from '../application/ports/Logger';
import { createPinoLogger } from './adapters/PinoLogger';

let mongoClient: MongoClient | null;
let healthRepository: HealthRepository | null;
let logger: Logger | null;

export function getLogger(): Logger {
  if (!logger) {
    logger = createPinoLogger();
  }
  return logger;
}

export async function getMongoConnection(): Promise<MongoClient> {
  if (!mongoClient) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is required');
    }
    mongoClient = await MongoClient.connect(mongoUri);
  }
  return mongoClient;
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

export async function closeConnections(): Promise<void> {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
  }
  healthRepository = null;
}

