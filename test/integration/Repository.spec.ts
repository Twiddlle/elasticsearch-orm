import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';
import { FactoryProvider } from '../../src/factory/Factory.provider';
import { TestingClass } from '../fixtures/TestingClass';

config({ path: path.join(__dirname, '.env') });

describe('Repository', () => {
  let repository: EsRepository<TestingClass>;

  beforeAll(async () => {
    repository = new EsRepository(
      new Client({
        nodes: [process.env.ELASTIC_HOST],
        auth: {
          username: process.env.ELASTIC_USERNAME,
          password: process.env.ELASTIC_PASSWORD,
        },
      }),
    );

    const schema =
      FactoryProvider.makeSchemaManager().generateIndexSchema(TestingClass);
    await repository.createIndex(TestingClass, schema);
  });

  afterAll(async () => {
    await repository.deleteIndex(TestingClass);
  });

  it('should create entity', async () => {
    const entity = new TestingClass();
    entity.foo = 1;
    entity.bar = true;
    entity.geoPoint = [14, 15];
    const createdEntity = await repository.create(entity);
    expect(createdEntity.id).toHaveLength(21);
    expect(createdEntity.foo).toBe(1);
    expect(createdEntity.bar).toBe(true);
    expect(createdEntity.geoPoint).toMatchObject([14, 15]);
  });
});
