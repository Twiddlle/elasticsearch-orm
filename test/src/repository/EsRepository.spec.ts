import { TestingClass } from '../../fixtures/TestingClass';
import { EsRepository } from '../../../src/repository/EsRepository';
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
            Foo: 123,
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
    expect(createdEntity.id).toBe('0eL8kTNJNs35P09tBGB3X');
    expect(createdEntity.foo).toBe(123);
    expect(createdEntity.bar).toBe(true);
    expect(createdEntity.geoPoint).toMatchObject([17, 18]);
  });
});
