import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';
import { FactoryProvider } from '../../src/factory/Factory.provider';
import { TestingClass } from '../fixtures/TestingClass';
import { ResponseError } from '@elastic/elasticsearch/lib/errors';

config({ path: path.join(__dirname, '.env') });

describe('Repository', () => {
  let repository: EsRepository<TestingClass>;
  let createdEntity: TestingClass;

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
    await repository.deleteIndex(TestingClass);
  });

  it('should create entity', async () => {
    const entity = new TestingClass();
    entity.foo = 1;
    entity.bar = true;
    entity.geoPoint = [14, 15];
    createdEntity = await repository.create(entity);
    expect(createdEntity.id).toHaveLength(21);
    expect(createdEntity.foo).toBe(1);
    expect(createdEntity.bar).toBe(true);
    expect(createdEntity.geoPoint).toMatchObject([14, 15]);
  });

  it('should get entity', async () => {
    const entity = await repository.findById(createdEntity.id, TestingClass);
    expect(entity.id).toHaveLength(21);
    expect(entity.foo).toBe(1);
    expect(entity.bar).toBe(true);
    expect(entity.geoPoint).toMatchObject([14, 15]);
  });

  it('should update entity', async () => {
    const entityToUpdate = Object.assign(new TestingClass(), createdEntity, {
      foo: 2,
    });
    const entity = await repository.update(entityToUpdate);
    expect(entity.id).toHaveLength(21);
    expect(entity.foo).toBe(2);
    expect(entity.bar).toBe(true);
    expect(entity.geoPoint).toMatchObject([14, 15]);
  });

  it('should index entity', async () => {
    const entityToUpdate = Object.assign(new TestingClass(), createdEntity, {
      foo: 3,
    });
    delete entityToUpdate.bar;
    const entity = await repository.save(entityToUpdate);
    expect(entity.id).toHaveLength(21);
    expect(entity.foo).toBe(3);
    expect(entity.bar).toBeUndefined();
    expect(entity.geoPoint).toMatchObject([14, 15]);
  });

  it('should delete entity', async () => {
    const res = await repository.delete(createdEntity);
    expect(res).toBeTruthy();

    let error: ResponseError;
    try {
      await repository.findById(createdEntity.id, TestingClass);
    } catch (e) {
      error = e;
    }

    expect(error.meta.statusCode).toBe(404);
  });
});
