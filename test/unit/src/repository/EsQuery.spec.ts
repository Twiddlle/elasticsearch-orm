import { EsQuery } from '../../../../src/repository/EsQuery';

describe('EsQuery', () => {
  it('typescript syntax for interfaces', () => {
    class x {
      y = 1;
      a = 2;
    }

    const query: EsQuery<x> = {
      fields: ['a', 'y'],
    };

    expect(query.fields[0]).toBe('a');
    expect(query.fields[1]).toBe('y');
  });
});
