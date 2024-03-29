import { EsEntity } from '../../src/decorators/EsEntity';
import { EsProperty } from '../../src/decorators/EsProperty';
import { EsId } from '../../src/decorators/EsId';

@EsEntity('test_index_main', {
  aliases: ['test_alias_read', 'test_alias_write'],
})
export class TestingClass {
  @EsId()
  public id: string;

  @EsProperty('integer', {
    additionalFieldOptions: {
      coerce: true,
    },
  })
  public foo: number;

  @EsProperty({ type: 'boolean' })
  public bar: boolean;

  @EsProperty('geo_point')
  public geoPoint: number[];

  @EsProperty('date')
  public createdAt: Date;

  @EsProperty('date')
  public updatedAt: Date[];
}
