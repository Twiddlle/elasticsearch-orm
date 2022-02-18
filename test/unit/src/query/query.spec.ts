import { EsSortTypes } from '../../../../src/query/sort';
import { TestingNestedClass } from '../../../fixtures/TestingNestedClass';
import { EsQuery } from '../../../../src/query/query';

describe('query', () => {
  it('simple', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const simpleQuery: EsQuery<TestingNestedClass> = {
      query: {
        match: {
          foo: {
            query: 'test',
          },
        },
      },
    };
  });
});
