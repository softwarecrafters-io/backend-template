import { Health } from '../entities/Health';

export interface HealthRepository {
  save(health: Health): Promise<void>;
  find(): Promise<Health | undefined>;
}

export class InMemoryHealthRepository implements HealthRepository {
  private health: Health | undefined;

  constructor(initialHealth?: Health) {
    this.health = initialHealth;
  }

  async save(health: Health): Promise<void> {
    this.health = health;
  }

  async find(): Promise<Health | undefined> {
    return this.health;
  }
}
