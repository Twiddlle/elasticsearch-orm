import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';
import { FactoryProvider } from '../../src/factory/Factory.provider';
import { TestingClassWithSnakeNamingStrategy } from '../fixtures/TestingClassWithSnakeNamingStrategy';
import { EsIndexInterface } from '../../src/types/EsIndex.interface';

config({ path: path.join(__dirname, '.env') });

describe('RepositoryNamingStrategy', () => {
  let repository: EsRepository<TestingClassWithSnakeNamingStrategy>;
  let createdEntity: TestingClassWithSnakeNamingStrategy;
  let schema: EsIndexInterface;

  beforeAll(async () => {
    repository = new EsRepository(
      TestingClassWithSnakeNamingStrategy,
      new Client({
        nodes: [process.env.ELASTIC_HOST],
        auth: {
          username: process.env.ELASTIC_USERNAME,
          password: process.env.ELASTIC_PASSWORD,
        },
      }),
    );

    try {
      schema = FactoryProvider.makeSchemaManager().generateIndexSchema(
        TestingClassWithSnakeNamingStrategy,
      );
      await repository.createIndex(schema);
    } catch (e) {
      console.warn(e.message);
    }
  });

  afterAll(async () => {
    await repository.deleteIndex();
  });

  it('should generate snake schema', () => {
    expect(schema.mappings.properties.full_name).toBeDefined();
    expect(schema.mappings.properties.full_address).toBeDefined();
  });

  it('should create nested entity', async () => {
    const entity = new TestingClassWithSnakeNamingStrategy();
    entity.fullName = 'Bill Gates';
    entity.fullAddress = "We don't know";

    createdEntity = await repository.create(entity);
    expect(createdEntity.id).toHaveLength(21);
    expect(createdEntity.fullName).toBe('Bill Gates');
    expect(createdEntity.fullAddress).toBe("We don't know");
  });
});
