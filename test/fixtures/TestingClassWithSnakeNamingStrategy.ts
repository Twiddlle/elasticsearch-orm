import { EsEntity } from '../../src/decorators/EsEntity';
import { EsProperty } from '../../src/decorators/EsProperty';
import { EsId } from '../../src/decorators/EsId';
import { snakeCaseNamingStrategy } from '../../src/utils/NamingStrategies';

@EsEntity('test_index_main_naming', {
  namingStrategy: snakeCaseNamingStrategy,
})
export class TestingClassWithSnakeNamingStrategy {
  @EsId()
  public id: string;

  @EsProperty('keyword')
  public fullName: string;

  @EsProperty({ type: 'keyword' })
  public fullAddress: string;
}
