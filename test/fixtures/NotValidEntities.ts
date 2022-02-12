import { EsId } from '../../src/decorators/EsId';
import { EsEntity } from '../../src/decorators/EsEntity';
import { ESClassFullTypeOptionsInterface } from '../../src/types/EsClassTypeOptions.interface';
import { EsProperty } from '../../src/decorators/EsProperty';

const entityOptions: ESClassFullTypeOptionsInterface = { index: 'test_index' };

export class NotValidEntity {}

@EsEntity(entityOptions)
export class NotValidEntityWithNoId {
  @EsProperty('double')
  public price: number;
}

@EsEntity(entityOptions)
export class NotValidEntityWithMultipleIds1 {
  @EsId()
  public id: string;

  @EsId()
  public identifier: string;
}

@EsEntity('test_index_main_nested')
export class NotValidNestedEntity {
  @EsId()
  public id: string;

  @EsProperty({
    type: 'nested',
    entity: class X {},
  })
  public image: { name: string; size: number };
}
