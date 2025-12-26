import { MongoHealthRepository } from '../../infrastructure/adapters/MongoHealthRepository';
import { Health } from '../../domain/entities/Health';
import { Id } from '../../../shared/domain/value-objects/Id';
import { createMongoClient } from '../../../shared/tests/testsFactory';

describe('The MongoHealthRepository', () => {
  let mongo: Awaited<ReturnType<typeof createMongoClient>>;
  let repository: MongoHealthRepository;

  const jan1At10am = new Date('2026-01-01T10:00:00.000Z');
  const jan1At10am5min = new Date('2026-01-01T10:05:00.000Z');
  const fiveMinutesInSeconds = 300;

  beforeAll(async () => {
    mongo = await createMongoClient();
    repository = new MongoHealthRepository(mongo.db());
  });

  afterAll(() => mongo.stop());
  beforeEach(() => mongo.clean());

  it('saves and finds health data', async () => {
    const id = Id.generate();
    const health = Health.create(id, jan1At10am, jan1At10am);

    await repository.save(health);
    const retrieved = await repository.find();

    expect(retrieved).toBeDefined();
    expect(retrieved?.toPrimitives().id).toBe(id.value);
  });

  it('finds nothing when empty', async () => {
    const retrieved = await repository.find();

    expect(retrieved).toBeUndefined();
  });

  it('maintains a single record across saves', async () => {
    const id = Id.generate();
    const health = Health.create(id, jan1At10am, jan1At10am);
    await repository.save(health);
    health.update(jan1At10am5min);
    await repository.save(health);

    const retrieved = await repository.find();

    expect(retrieved?.toPrimitives().id).toBe(id.value);
  });

  it('preserves creation time across updates', async () => {
    const health = Health.create(Id.generate(), jan1At10am, jan1At10am);
    await repository.save(health);
    health.update(jan1At10am5min);
    await repository.save(health);

    const retrieved = await repository.find();
    const primitives = retrieved?.toPrimitives();

    expect(primitives?.createdAt).toBe(jan1At10am.toISOString());
    expect(primitives?.lastCheckedAt).toBe(jan1At10am5min.toISOString());
    expect(retrieved?.uptime()).toBe(fiveMinutesInSeconds);
  });
});
