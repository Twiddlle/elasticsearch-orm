import { EsEntity } from '../../src/decorators/EsEntity';
import { EsProperty } from '../../src/decorators/EsProperty';
import { EsId } from '../../src/decorators/EsId';

@EsEntity((entity: TestingClassWithIndexFn, query) => {
  return 'fn_testing_index';
})
export class TestingClassWithIndexFn {
  @EsId()
  public id: string;

  @EsProperty('integer', {
    additionalFieldOptions: {
      boost: 10,
    },
  })
  public foo: number;

  @EsProperty({ type: 'boolean' })
  public bar: boolean;

  @EsProperty('geo_point')
  public geoPoint: number[];
}
