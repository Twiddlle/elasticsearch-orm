import { TestingClass } from '../../fixtures/TestingClass';
import { EsRepository } from '../../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';

describe('Es Repository', () => {
  let repository: EsRepository;
  let client: Client;

  beforeAll(() => {
    client = new Client({
      nodes: ['http://localhost:9200'],
    });
    repository = new EsRepository(client);
  });

  it('create valid entity', async () => {
    jest.spyOn(client, 'create').mockImplementationOnce(() => {
      return {
        abort: () => undefined,
        result: 'created',
      };
    });

    const entityToCreate = new TestingClass();
    entityToCreate.foo = 123;
    entityToCreate.bar = true;
    entityToCreate.geoPoint = [17, 18];
    const createdEntity = await repository.create(entityToCreate);
    expect(createdEntity.id).toHaveLength(21);
    expect(createdEntity.foo).toBe(123);
    expect(createdEntity.bar).toBe(true);
    expect(createdEntity.geoPoint).toMatchObject([17, 18]);
  });
});
