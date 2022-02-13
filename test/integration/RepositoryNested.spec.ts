import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';
import { FactoryProvider } from '../../src/factory/Factory.provider';
import {
  TestingAuthorClass,
  TestingImageClass,
  TestingNestedClass,
} from '../fixtures/TestingNestedClass';

config({ path: path.join(__dirname, '.env') });

describe('RepositoryNested', () => {
  let repository: EsRepository<TestingNestedClass>;
  let createdEntity: TestingNestedClass;

  beforeAll(async () => {
    repository = new EsRepository(
      TestingNestedClass,
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
        FactoryProvider.makeSchemaManager().generateIndexSchema(
          TestingNestedClass,
        );
      await repository.createIndex(schema);
    } catch (e) {
      console.warn(e.message);
    }
  });

  afterAll(async () => {
    await repository.deleteIndex();
  });

  it('should create nested entity', async () => {
    const entity = new TestingNestedClass();
    entity.foo = 1;

    entity.image = new TestingImageClass();
    entity.image.size = 1024;
    entity.image.name = 'x';

    entity.author = new TestingAuthorClass();
    entity.author.image = new TestingImageClass();
    entity.author.image.name = 'profile pic';
    entity.author.image.size = 2895;
    entity.author.name = 'Jason';
    createdEntity = await repository.create(entity);
    expect(createdEntity.id).toHaveLength(21);
    expect(createdEntity.foo).toBe(1);
    expect(createdEntity.image).toBeInstanceOf(TestingImageClass);
    expect(createdEntity.image.name).toBe('x');
    expect(createdEntity.image.size).toBe(1024);
    expect(createdEntity.author).toBeInstanceOf(TestingAuthorClass);
    expect(createdEntity.author.name).toBe('Jason');
    expect(createdEntity.author.image.name).toBe('profile pic');
    expect(createdEntity.author.image.size).toBe(2895);
  });
});
