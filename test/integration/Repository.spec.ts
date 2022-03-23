import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';
import { FactoryProvider } from '../../src/factory/Factory.provider';
import { TestingClass } from '../fixtures/TestingClass';
import { ResponseError } from '@elastic/elasticsearch/lib/errors';
import { EsException } from '../../src/exceptions/EsException';
import { EsEntityNotFoundException } from '../../src/exceptions/EsEntityNotFoundException';

config({ path: path.join(__dirname, '.env') });

describe('Repository', () => {
  let repository: EsRepository<TestingClass>;
  let createdEntity: TestingClass;

  beforeAll(async () => {
    repository = new EsRepository(
      TestingClass,
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
      await repository.createIndex(schema);
    } catch (e) {
      console.warn(e.message);
    }
  });

  afterAll(async () => {
    await repository.deleteIndex();
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
    const entity = await repository.findById(createdEntity.id);
    expect(entity.id).toHaveLength(21);
    expect(entity.foo).toBe(1);
    expect(entity.bar).toBe(true);
    expect(entity.geoPoint).toMatchObject([14, 15]);
  });

  it('should find entity', async () => {
    const foundEntity = await repository.find({
      query: {
        term: {
          foo: 1,
        },
      },
    });

    expect(foundEntity[0].id).toHaveLength(21);
    expect(foundEntity[0].foo).toBe(1);
    expect(foundEntity[0].bar).toBe(true);
    expect(foundEntity[0].geoPoint).toMatchObject([14, 15]);
  });

  it('should find one entity', async () => {
    const foundEntity = await repository.findOne({
      query: {
        term: {
          foo: 1,
        },
      },
    });

    expect(foundEntity.id).toHaveLength(21);
  });

  it('should not find one entity', async () => {
    const foundEntity = await repository.findOne({
      query: {
        term: {
          foo: 9999999,
        },
      },
    });

    expect(foundEntity).toBeUndefined();
  });

  it('should find one or fail entity', async () => {
    const foundEntity = await repository.findOneOrFail({
      query: {
        term: {
          foo: 1,
        },
      },
    });

    expect(foundEntity.id).toHaveLength(21);
  });

  it('should not find one or fail entity', async () => {
    let error;
    try {
      await repository.findOneOrFail({
        query: {
          term: {
            foo: 9999999,
          },
        },
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(EsEntityNotFoundException);
    expect(error.message).toBe('Entity not found');
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

    let error: EsException;
    try {
      await repository.findById(createdEntity.id);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(EsException);
    expect((error.originalError as ResponseError).meta.statusCode).toBe(404);
  });
});
