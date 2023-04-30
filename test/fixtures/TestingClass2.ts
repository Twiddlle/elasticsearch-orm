import { EsEntity } from '../../src/decorators/EsEntity';
import { EsProperty } from '../../src/decorators/EsProperty';
import { EsId } from '../../src/decorators/EsId';

@EsEntity('test_index_main_2', {
  aliases: ['test_alias_read_2', 'test_alias_write_2'],
})
export class TestingClass {
  @EsId()
  public id: string;

  @EsProperty('integer', {
    additionalFieldOptions: {
      coerce: true,
    },
  })
  public foo2: number;

  @EsProperty({ type: 'boolean' })
  public bar2: boolean;

  @EsProperty('geo_point')
  public geoPoint2: number[];
}
