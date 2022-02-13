import { EsEntity } from '../../src/decorators/EsEntity';
import { EsProperty } from '../../src/decorators/EsProperty';
import { EsId } from '../../src/decorators/EsId';
import { camelCaseNamingStrategy } from '../../src/utils/NamingStrategies';

@EsEntity('test_index_main_naming_camel', {
  namingStrategy: camelCaseNamingStrategy,
})
export class TestingClassWithCamelNamingStrategy {
  @EsId()
  public id: string;

  @EsProperty('keyword')
  public full_name: string;

  @EsProperty({ type: 'keyword' })
  public full_address: string;
}
