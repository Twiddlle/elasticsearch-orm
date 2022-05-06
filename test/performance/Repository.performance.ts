import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';
import { FactoryProvider } from '../../src/factory/Factory.provider';
import { HugeTestingClass } from '../fixtures/HugeTestingClass';
import { EntityTransformer } from '../../src/utils/EntityTransformer';

config({ path: path.join(__dirname, '..', '.env') });

describe('Repository.performance', () => {
  let repository: EsRepository<HugeTestingClass>;
  let entityTransformer: EntityTransformer;
  let entities: HugeTestingClass[];

  beforeAll(async () => {
    entities = new Array(1000).fill(1).map(() => {
      return new HugeTestingClass();
    });
    entityTransformer = FactoryProvider.makeEntityTransformer();
    repository = new EsRepository(
      HugeTestingClass,
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
        FactoryProvider.makeSchemaManager().generateIndexSchema(
          HugeTestingClass,
        );
      await repository.createIndex(schema);
    } catch (e) {
      console.warn(e.message);
    }
  });

  afterAll(async () => {
    await repository.deleteIndex();
  });

  it('should test performance of normalization/denormalization', async () => {
    let normalizationTook = Date.now();
    const normalizedEntities = entityTransformer.normalize(entities);
    normalizationTook = Date.now() - normalizationTook;
    expect(normalizationTook).toBeLessThan(30);

    let denormalizationTook = Date.now();
    entityTransformer.denormalize(HugeTestingClass, normalizedEntities);
    denormalizationTook = Date.now() - denormalizationTook;
    expect(denormalizationTook).toBeLessThan(300);
  });

  it('should test huge bulk store', async () => {
    let storeTook = Date.now();
    await repository.createMultiple(entities);
    storeTook = Date.now() - storeTook;
    expect(storeTook).toBeLessThan(6000);
  }, 60000);
});
