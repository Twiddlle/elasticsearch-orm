import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';
import { FactoryProvider } from '../../src/factory/Factory.provider';
import {
  TestingAuthorClass,
  TestingImageClass,
  TestingNestedArrayClass,
} from '../fixtures/TestingNestedClass';

config({ path: path.join(__dirname, '..', '.env') });

describe('RepositoryNestedArray', () => {
  let repository: EsRepository<TestingNestedArrayClass>;
  let createdEntity: TestingNestedArrayClass;

  beforeAll(async () => {
    repository = new EsRepository(
      TestingNestedArrayClass,
      new Client({
        nodes: [process.env.ELASTIC_HOST],
        auth: {
          username: process.env.ELASTIC_USERNAME,
          password: process.env.ELASTIC_PASSWORD,
        },
      }),
    );

    try {
      const schema = FactoryProvider.makeSchemaManager().generateIndexSchema(
        TestingNestedArrayClass,
      );
      await repository.createIndex(schema);
    } catch (e) {
      console.warn(e.message);
    }
  });

  afterAll(async () => {
    await repository.deleteIndex();
  });

  it('should create nested array entity', async () => {
    const entity = new TestingNestedArrayClass();
    entity.foo = [1, 2, 3];

    entity.image = new TestingImageClass();
    entity.image.size = 1024;
    entity.image.name = 'x';

    entity.author = [new TestingAuthorClass(), new TestingAuthorClass()];
    entity.author[0].image = new TestingImageClass();
    entity.author[0].image.name = 'profile pic';
    entity.author[0].image.size = 2895;
    entity.author[0].name = 'Jason';
    entity.author[1].image = new TestingImageClass();
    entity.author[1].image.name = 'me myself and I';
    entity.author[1].image.size = 3598;
    entity.author[1].name = 'Hank';
    createdEntity = (await repository.create(entity)).entity;
    expect(createdEntity.id).toHaveLength(21);
    expect(createdEntity.foo).toMatchObject([1, 2, 3]);
    expect(createdEntity.image).toBeInstanceOf(TestingImageClass);
    expect(createdEntity.image.name).toBe('x');
    expect(createdEntity.image.size).toBe(1024);
    expect(createdEntity.author[0]).toBeInstanceOf(TestingAuthorClass);
    expect(createdEntity.author[1]).toBeInstanceOf(TestingAuthorClass);
    expect(createdEntity.author[0].name).toBe('Jason');
    expect(createdEntity.author[0].image.name).toBe('profile pic');
    expect(createdEntity.author[0].image.size).toBe(2895);
    expect(createdEntity.author[1].name).toBe('Hank');
    expect(createdEntity.author[1].image.name).toBe('me myself and I');
    expect(createdEntity.author[1].image.size).toBe(3598);
  });
});
