import { EsEntity } from '../../src/decorators/EsEntity';
import { EsProperty } from '../../src/decorators/EsProperty';
import { EsId } from '../../src/decorators/EsId';

export class TestingImageClass {
  @EsProperty('keyword')
  public name: string;

  @EsProperty('integer')
  public size: number;
}

@EsEntity('test_index_main_nested', {
  aliases: ['test_alias_read_nested', 'test_alias_read_nested'],
})
export class TestingNestedClass {
  @EsId()
  public id: string;

  @EsProperty('integer', {
    name: 'Foo',
    additionalFieldOptions: {
      boost: 10,
    },
  })
  public foo: number;

  @EsProperty({
    type: 'nested',
    entity: TestingImageClass,
  })
  public image: { name: string; size: number };
}
