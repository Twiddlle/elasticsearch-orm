import { EsSortTypes } from '../../../../src/query/sort';
import { TestingNestedClass } from '../../../fixtures/TestingNestedClass';

describe('sort', () => {
  it('complex', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const complexSort: EsSortTypes<TestingNestedClass> = [
      {
        image: { order: 'asc' },
      },
      {
        foo: { order: 'asc' },
      },
      {
        _geo_distance: {
          foo: [1, 1],
          order: 'asc',
        },
      },
      {
        anything: {
          order: 'desc',
          nested: {
            path: 'image',
          },
          unmapped_type: 'long',
        },
      },
      {
        image: {
          order: 'desc',
          nested: {
            path: 'image',
          },
          unmapped_type: 'long',
        },
      },
    ];
  });

  it('script', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const scriptSort: EsSortTypes<TestingNestedClass> = {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          source: "doc['field_name'].value * params.factor",
          params: {
            factor: 1.1,
          },
          order: 'asc',
        },
      },
    };
  });

  it('nested', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const scriptSort: EsSortTypes<TestingNestedClass> = [
      {
        image: {
          order: 'asc',
        },
      },
      {
        'image.name': {
          mode: 'avg',
          order: 'desc',
          nested: {
            path: 'image',
            filter: {
              term: { 'image.size': 1024 },
            },
          },
        },
      },
    ];
  });

  it('scalar', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const scriptSort: EsSortTypes<TestingNestedClass> = ['_score'];
  });

  it('no generic', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const scriptSort: EsSortTypes = ['_score'];
  });
});
