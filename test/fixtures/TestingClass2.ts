import { EsEntity } from '../../src/decorators/EsEntity';
import { EsProperty } from '../../src/decorators/EsProperty';

@EsEntity('test_index_main_2', {
  alisases: ['test_alias_read_2', 'test_alias_write_2'],
})
export class TestingClass {
  @EsProperty('integer', {
    name: 'Foo_2',
    fieldOptions: {
      boost: 10,
    },
  })
  public foo2: number;

  @EsProperty({ type: 'boolean' })
  public bar2: boolean;

  @EsProperty('geo_point')
  public geoPoint2: number[];
}
