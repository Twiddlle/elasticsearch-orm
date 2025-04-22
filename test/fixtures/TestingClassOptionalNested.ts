import { EsEntity } from '../../src/decorators/EsEntity';
import { EsId } from '../../src/decorators/EsId';
import { EsProperty } from '../../src/decorators/EsProperty';

export class MyOptionalNestedEntity {
  @EsProperty('keyword')
  public name: string;
}

@EsEntity('elastic_index')
export class MyRootEntityWithOptionalNested {
  @EsId()
  public id: string;

  @EsProperty('integer')
  public foo: number;

  @EsProperty({ type: 'nested', entity: MyOptionalNestedEntity })
  public nestedItem?: MyOptionalNestedEntity;

  @EsProperty({ type: 'nested', entity: MyOptionalNestedEntity })
  public nestedItems?: MyOptionalNestedEntity[];
}
