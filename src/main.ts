import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { createServer } from './shared/infrastructure/server';
import { getMongoConnection, closeConnections, getLogger } from './shared/infrastructure/factory';

async function main(): Promise<void> {
  const logger = getLogger();
  const port = process.env.PORT || 3000;
  try {
    const client = await getMongoConnection();
    logger.info('Connected to MongoDB');
    const server = createServer(client);
    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down...');
      await closeConnections();
      process.exit(0);
    });
    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down...');
      await closeConnections();
      process.exit(0);
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

main();
