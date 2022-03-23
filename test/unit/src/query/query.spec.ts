import { TestingNestedClass } from '../../../fixtures/TestingNestedClass';
import { EsQuery } from '../../../../src/query/query';

describe('query', () => {
  it('simple', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const simpleQuery1: EsQuery<TestingNestedClass> = {
      query: {
        match: {},
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const simpleQuery2: EsQuery<TestingNestedClass> = {
      query: {
        match: {
          id: 'entity-id',
        },
      },
    };
  });

  it('complex', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const simpleQuery: EsQuery<TestingNestedClass> = {
      query: {
        exists: {
          field: 'geo_point',
        },
      },
    };
  });
});
