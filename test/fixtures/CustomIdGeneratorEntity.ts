import { EsEntity } from '../../src/decorators/EsEntity';
import { EsId } from '../../src/decorators/EsId';
import { EsProperty } from '../../src/decorators/EsProperty';

@EsEntity('test')
export class CustomIdGeneratorEntity {
  @EsId({
    generator: () => {
      return 'myCustomId';
    },
  })
  public id: string;

  @EsProperty('keyword')
  public foo: string;
}
