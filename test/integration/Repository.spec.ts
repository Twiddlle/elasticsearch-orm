import { config } from 'dotenv';
import * as path from 'path';
import { EsRepository } from '../../src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';

config({ path: path.join(__dirname, '.env') });

describe('Repository', () => {
  let repository: EsRepository;

  beforeAll(() => {
    repository = new EsRepository(
      new Client({
        nodes: [process.env.ELASTIC_HOST],
        auth: {
          username: process.env.ELASTIC_USERNAME,
          password: process.env.ELASTIC_PASSWORD,
        },
      }),
    );
  });

  it('should create entity', function () {});
});
