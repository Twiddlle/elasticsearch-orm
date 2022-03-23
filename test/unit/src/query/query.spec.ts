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
    const query: EsQuery<TestingNestedClass> = {
      query: {
        exists: {
          field: 'geo_point',
        },
      },
    };
  });

  it('geo', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const query: EsQuery<TestingNestedClass> = {
      query: {
        geo_distance: {
          foo: [1, 2],
          distance: '20km',
        },
      },
    };
  });
});
