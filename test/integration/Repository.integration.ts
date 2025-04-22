import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';
import { FactoryProvider } from '../../src/factory/Factory.provider';
import { TestingClass } from '../fixtures/TestingClass';
import { EsException } from '../../src/exceptions/EsException';
import { EsEntityNotFoundException } from '../../src/exceptions/EsEntityNotFoundException';
import * as bodybuilder from 'bodybuilder';
import { ElasticsearchClientError } from '@elastic/transport/lib/errors';

config({ path: path.join(__dirname, '..', '.env') });

describe('Repository.integration', () => {
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

    repository.on('beforeRequest', (action, esParams) => {
      if (action === 'find') {
        esParams.explain = true;
      }
    });

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
    entity.createdAt = new Date('2022-04-01T00:00:00.000Z');
    entity.updatedAt = [
      new Date('2022-04-01T00:00:00.000Z'),
      new Date('2022-04-02T00:00:00.000Z'),
    ];
    const createdRes = await repository.create(entity);
    createdEntity = createdRes.entity;
    expect(createdEntity.id).toHaveLength(21);
    expect(createdEntity.foo).toBe(1);
    expect(createdEntity.bar).toBe(true);
    expect(createdEntity.geoPoint).toMatchObject([14, 15]);
    expect(createdEntity.createdAt).toBeInstanceOf(Date);
    expect(createdEntity.createdAt.toISOString()).toBe(
      '2022-04-01T00:00:00.000Z',
    );
    expect(createdEntity.updatedAt).toHaveLength(2);
    expect(JSON.stringify(createdEntity.updatedAt)).toBe(
      '["2022-04-01T00:00:00.000Z","2022-04-02T00:00:00.000Z"]',
    );
    expect(createdEntity.updatedAt[0]).toBeInstanceOf(Date);
    expect(createdEntity.updatedAt[1]).toBeInstanceOf(Date);
    expect(createdEntity.updatedAt[0].toISOString()).toBe(
      '2022-04-01T00:00:00.000Z',
    );
    expect(createdEntity.updatedAt[1].toISOString()).toBe(
      '2022-04-02T00:00:00.000Z',
    );
  });

  it('should get entity', async () => {
    const entity = await repository.findById(createdEntity.id);
    expect(entity.entity.id).toHaveLength(21);
    expect(entity.entity.foo).toBe(1);
    expect(entity.entity.bar).toBe(true);
    expect(entity.entity.geoPoint).toMatchObject([14, 15]);
  });

  it('should find entity', async () => {
    const foundEntity = await repository.find({
      query: {
        term: {
          foo: 1,
        },
      },
    });

    expect(foundEntity.raw.hits.hits[0]._explanation).toBeDefined();
    expect(foundEntity.entities[0].id).toHaveLength(21);
    expect(foundEntity.entities[0].foo).toBe(1);
    expect(foundEntity.entities[0].bar).toBe(true);
    expect(foundEntity.entities[0].geoPoint).toMatchObject([14, 15]);
  });

  it('should find entity with extra params', async () => {
    const foundEntity = await repository.find(
      {
        query: {
          term: {
            foo: 1,
          },
        },
      },
      {
        _source: ['foo'],
      },
    );

    expect(foundEntity.entities[0].id).toHaveLength(21);
    expect(foundEntity.entities[0].foo).toBe(1);
    expect(foundEntity.entities[0].bar).toBeUndefined();
    expect(foundEntity.entities[0].geoPoint).toBeUndefined();
  });

  it('should find one entity', async () => {
    const foundEntity = await repository.findOne({
      query: {
        term: {
          foo: 1,
        },
      },
    });

    expect(foundEntity.entity.id).toHaveLength(21);
  });

  it('should not find one entity', async () => {
    const foundEntity = await repository.findOne({
      query: {
        term: {
          foo: 9999999,
        },
      },
    });

    expect(foundEntity.entity).toBeUndefined();
  });

  it('should find one or fail entity', async () => {
    const foundEntity = await repository.findOneOrFail({
      query: {
        term: {
          foo: 1,
        },
      },
    });

    expect(foundEntity.entity.id).toHaveLength(21);
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
    expect(entity.entity.id).toHaveLength(21);
    expect(entity.entity.foo).toBe(2);
    expect(entity.entity.bar).toBe(true);
    expect(entity.entity.geoPoint).toMatchObject([14, 15]);
  });

  it('should index entity', async () => {
    const entityToUpdate = Object.assign(new TestingClass(), createdEntity, {
      foo: 3,
    });
    delete entityToUpdate.bar;
    const entity = await repository.index(entityToUpdate);
    expect(entity.entity.id).toHaveLength(21);
    expect(entity.entity.foo).toBe(3);
    expect(entity.entity.bar).toBeUndefined();
    expect(entity.entity.geoPoint).toMatchObject([14, 15]);
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
    // expect((error.originalError).meta.statusCode).toBe(404);
  });

  it('should delete by query', async () => {
    const entity = new TestingClass();
    entity.foo = 1;
    entity.bar = true;
    entity.geoPoint = [14, 15];
    entity.createdAt = new Date('2022-04-01T00:00:00.000Z');
    entity.updatedAt = [
      new Date('2022-04-01T00:00:00.000Z'),
      new Date('2022-04-02T00:00:00.000Z'),
    ];
    const { entity: createdEntity } = await repository.create(entity);
    const res = await repository.deleteByQuery({
      query: {
        ids: {
          values: [createdEntity.id],
        },
      },
    });
    expect(res.deleted).toBe(1);
    expect(res.raw.deleted).toBe(1);
  });

  it('should create multiple entities', async () => {
    const entities = [
      Object.assign(new TestingClass(), { foo: 555 }),
      Object.assign(new TestingClass(), { foo: 556 }),
      Object.assign(new TestingClass(), { foo: 557 }),
    ];
    const createdEntities = await repository.createMultiple(entities);
    expect(createdEntities.entities).toHaveLength(3);
    expect(createdEntities.hasErrors).toBeFalsy();
    expect(createdEntities.raw.items).toHaveLength(3);
    expect(createdEntities.entities[0].id).toHaveLength(21);
    expect(createdEntities.entities[0].foo).toBe(555);
    expect(createdEntities.entities[1].id).toHaveLength(21);
    expect(createdEntities.entities[1].foo).toBe(556);
    expect(createdEntities.entities[2].id).toHaveLength(21);
    expect(createdEntities.entities[2].foo).toBe(557);
  });

  it('should not create multiple entities with no data provided', async () => {
    let error;
    try {
      await repository.createMultiple([]);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(EsException);
    expect((error.originalError as ElasticsearchClientError).message).toContain(
      'request body is required',
    );
  });

  it('should create partially multiple entities', async () => {
    const multiRes = await repository.createMultiple([
      Object.assign(new TestingClass(), { foo: 555 }),
      Object.assign(new TestingClass(), { foo: { x: 1 } }),
    ]);
    expect(multiRes.hasErrors).toBe(true);
    expect(multiRes.entities).toHaveLength(1);
    expect(multiRes.entities[0].foo).toBe(555);
  });

  it('should update multiple entities', async () => {
    const entities = [
      Object.assign(new TestingClass(), { foo: 653 }),
      Object.assign(new TestingClass(), { foo: 654 }),
    ];
    const createdEntities = await repository.createMultiple(entities);
    const updatedEntities = await repository.updateMultiple([
      Object.assign(createdEntities.entities[0], { foo: 111 }),
      Object.assign(createdEntities.entities[1], { foo: 222 }),
    ]);
    expect(updatedEntities.entities).toHaveLength(2);
    expect(updatedEntities.hasErrors).toBeFalsy();
    expect(updatedEntities.raw.items).toHaveLength(2);
    expect(updatedEntities.entities[0].id).toHaveLength(21);
    expect(updatedEntities.entities[0].foo).toBe(111);
    expect(updatedEntities.entities[1].id).toHaveLength(21);
    expect(updatedEntities.entities[1].foo).toBe(222);
  });

  it('should save multiple entities', async () => {
    const entities = [
      Object.assign(new TestingClass(), { foo: 653 }),
      Object.assign(new TestingClass(), { foo: 654 }),
    ];
    const createdEntities = await repository.createMultiple(entities);
    expect(createdEntities.entities[0].bar).toBeUndefined();
    expect(createdEntities.entities[1].bar).toBeUndefined();
    const savedEntities = await repository.indexMultiple([
      Object.assign(createdEntities.entities[0], { bar: true, foo: undefined }),
      Object.assign(createdEntities.entities[1], {
        bar: false,
        foo: undefined,
      }),
    ]);
    expect(savedEntities.entities).toHaveLength(2);
    expect(savedEntities.hasErrors).toBeFalsy();
    expect(savedEntities.raw.items).toHaveLength(2);
    expect(savedEntities.entities[0].id).toHaveLength(21);
    expect(savedEntities.entities[0].foo).toBeUndefined();
    expect(savedEntities.entities[1].id).toHaveLength(21);
    expect(savedEntities.entities[1].foo).toBeUndefined();
  });

  it('should delete multiple entities', async () => {
    const entities = [
      Object.assign(new TestingClass(), { foo: 999 }),
      Object.assign(new TestingClass(), { foo: 1000 }),
    ];
    const createdEntities = await repository.createMultiple(entities);
    const ids = createdEntities.entities.map((entity) => entity.id);
    const deletedRes = await repository.deleteMultiple(ids);
    expect(deletedRes.raw.items).toHaveLength(2);
    expect(deletedRes.hasErrors).toBeFalsy();

    const verifyDeletion = await repository.find({
      query: {
        ids: {
          values: ids,
        },
      },
    });

    expect(verifyDeletion.entities).toHaveLength(0);
  });

  it('should find entities with bodybuilder', async () => {
    const body = bodybuilder().query('match', 'foo', 111).build();
    const res = await repository.findOne(body);

    expect(res.entity.foo).toBe(111);
  });
});
