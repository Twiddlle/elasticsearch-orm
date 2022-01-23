import { EsProperty } from '../decorators/EsProperty';
import { MetaLoader } from './MetaLoader';
import { EsEntity } from '../decorators/EsEntity';

@EsEntity('test_index_main', {
  alisases: ['test_alias_read', 'test_alias_write'],
})
class TestingClass {
  @EsProperty('integer', {
    name: 'Foo',
    fieldOptions: {
      boost: 10,
    },
  })
  public foo: number;

  @EsProperty({ type: 'boolean' })
  public bar: boolean;

  @EsProperty('geo_point')
  public geoPoint: number[];
}

describe('meta loader', () => {
  let metaLoader: MetaLoader;

  beforeAll(() => {
    metaLoader = new MetaLoader();
  });

  it('should load metadata', function () {
    const metadata = metaLoader.getReflectMetaData(TestingClass);

    expect(metadata.entity.index).toBe('test_index_main');
    expect(metadata.entity.name).toBe(TestingClass.name);
    expect(metadata.entity.alisases[0]).toBe('test_alias_read');
    expect(metadata.entity.alisases[1]).toBe('test_alias_write');

    expect(metadata.props[0].type).toBe('integer');
    expect(metadata.props[0].name).toBe('Foo');
    expect(metadata.props[0].fieldOptions.boost).toBe(10);
    expect(metadata.props[1].type).toBe('boolean');
    expect(metadata.props[1].name).toBe('bar');
    expect(metadata.props[2].type).toBe('geo_point');
    expect(metadata.props[2].name).toBe('geoPoint');
  });
});
