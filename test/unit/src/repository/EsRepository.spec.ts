import { TestingClass } from '../../../fixtures/TestingClass';
import { EsRepository } from '../../../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';

describe('Es Repository', () => {
  let repository: EsRepository<TestingClass>;
  let client: Client;

  beforeAll(() => {
    client = new Client({
      nodes: ['http://localhost:9200'],
    });
    repository = new EsRepository(TestingClass, client);
  });

  it('create valid entity', async () => {
    jest.spyOn(client, 'create').mockImplementationOnce(() => {
      return {
        abort: () => undefined,
        result: 'created',
      };
    });

    jest.spyOn(client, 'get').mockImplementationOnce(() => {
      return {
        abort: () => undefined,
        body: {
          _id: '0eL8kTNJNs35P09tBGB3X',
          _source: {
            foo: 123,
            bar: true,
            geoPoint: [17, 18],
          },
        },
      };
    });

    const entityToCreate = new TestingClass();
    entityToCreate.foo = 123;
    entityToCreate.bar = true;
    entityToCreate.geoPoint = [17, 18];
    const createdEntity = await repository.create(entityToCreate);
    expect(createdEntity.entity.id).toBe('0eL8kTNJNs35P09tBGB3X');
    expect(createdEntity.entity.foo).toBe(123);
    expect(createdEntity.entity.bar).toBe(true);
    expect(createdEntity.entity.geoPoint).toMatchObject([17, 18]);
  });
});
