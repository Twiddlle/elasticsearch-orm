import { EsEntity } from '../../src/decorators/EsEntity';
import { EsId } from '../../src/decorators/EsId';
import { EsProperty } from '../../src/decorators/EsProperty';

export class MyNestedEntity {
  @EsProperty('keyword')
  public name: string;
}

@EsEntity('elastic_index')
export class MyRootEntity {
  @EsId()
  public id: string;

  @EsProperty('integer')
  public foo: number;

  @EsProperty({ type: 'nested', entity: MyNestedEntity })
  public nestedItem?: MyNestedEntity;

  @EsProperty({ type: 'nested', entity: MyNestedEntity })
  public nestedItems?: MyNestedEntity[];
}
