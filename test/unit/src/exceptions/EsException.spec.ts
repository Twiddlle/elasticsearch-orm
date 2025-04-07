import { EsException } from '../../../../src/exceptions/EsException';

describe('EsException', () => {
  it('sets both originalCause and cause', () => {
    const original = new Error('original');
    const wrapper = new EsException('wrapper', original);

    // conventional ES6
    expect(wrapper.originalError).toBe(original);
    // standard ES2021
    expect(wrapper.cause).toBe(original);
  });

  // this happens in `makeEsException`
  it('setting originalCause also sets cause', () => {
    const wrapper = new EsException('wrapper');
    const original = new Error('original');
    wrapper.originalError = original;

    // conventional ES6
    expect(wrapper.originalError).toBe(original);
    // standard ES2021
    expect(wrapper.cause).toBe(original);
  });
});
