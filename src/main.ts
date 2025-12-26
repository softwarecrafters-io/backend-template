import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { createServer } from './shared/infrastructure/server';
import { connectToMongo, getLogger } from './shared/infrastructure/factory';

async function main(): Promise<void> {
  const logger = getLogger();
  const port = process.env.PORT || 3000;
  try {
    const client = await connectToMongo();
    logger.info('Connected to MongoDB');
    const server = createServer(client);
    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
    const shutdown = async () => {
      logger.info('Shutting down...');
      await client.close();
      process.exit(0);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

main();
