import { EsEntity } from '../../src/decorators/EsEntity';
import { EsProperty } from '../../src/decorators/EsProperty';
import { EsId } from '../../src/decorators/EsId';

export class TestingImageClass {
  @EsProperty('text', {
    additionalFieldOptions: {
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
  })
  public name: string;

  @EsProperty('integer')
  public size: number;
}

export class TestingAuthorClass {
  @EsProperty('keyword')
  public name: string;

  @EsProperty(TestingImageClass)
  public image: TestingImageClass;
}

@EsEntity('test_index_main_nested', {
  mapping: {
    dynamic: 'strict',
  },
})
export class TestingNestedClass {
  @EsId()
  public id: string;

  @EsProperty('integer', {
    additionalFieldOptions: {
      boost: 10,
    },
  })
  public foo: number;

  @EsProperty({
    type: 'nested',
    entity: TestingImageClass,
  })
  public image: TestingImageClass;

  @EsProperty(TestingAuthorClass)
  public author: TestingAuthorClass;
}

@EsEntity('test_index_main_nested_array')
export class TestingNestedArrayClass {
  @EsId()
  public id: string;

  @EsProperty('integer', {
    additionalFieldOptions: {
      boost: 10,
    },
  })
  public foo: number[];

  @EsProperty({
    type: 'nested',
    entity: TestingImageClass,
  })
  public image: TestingImageClass;

  @EsProperty(TestingAuthorClass)
  public author: TestingAuthorClass[];
}
