import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';
import { FactoryProvider } from '../../src/factory/Factory.provider';
import { TestingClass } from '../fixtures/TestingClass';
import { TestingNestedClass } from '../fixtures/TestingNestedClass';

config({ path: path.join(__dirname, '.env') });

describe('RepositoryNested', () => {
  let repository: EsRepository<TestingNestedClass>;
  let createdEntity: TestingNestedClass;

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

    try {
      const schema =
        FactoryProvider.makeSchemaManager().generateIndexSchema(TestingClass);
      await repository.createIndex(TestingClass, schema);
    } catch (e) {
      console.warn(e.message);
    }
  });

  afterAll(async () => {
    await repository.deleteIndex(TestingNestedClass);
  });

  it('should create nested entity', async () => {
    const entity = new TestingNestedClass();
    entity.foo = 1;
    entity.image = {
      name: 'x',
      size: 1024,
    };
    createdEntity = await repository.create(entity);
    expect(createdEntity.id).toHaveLength(21);
    expect(createdEntity.foo).toBe(1);
    expect(createdEntity.image.name).toBe('x');
    expect(createdEntity.image.size).toBe(1024);
  });
});
