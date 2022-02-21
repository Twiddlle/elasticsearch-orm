import { TestingNestedClass } from '../../../fixtures/TestingNestedClass';
import { EsQueryFieldsTypes } from '../../../../src/query/fields';

describe('fields', () => {
  it('complex', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const complexSort: EsQueryFieldsTypes<TestingNestedClass> = [
      {
        field: 'foo',
        format: 'epoch_millis',
      },
      'image',
      '*',
    ];
  });
});
