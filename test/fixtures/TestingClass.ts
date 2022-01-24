import {EsEntity} from "../../src/decorators/EsEntity";
import {EsProperty} from "../../src/decorators/EsProperty";

@EsEntity('test_index_main', {
  alisases: ['test_alias_read', 'test_alias_write'],
})
export class TestingClass {
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
