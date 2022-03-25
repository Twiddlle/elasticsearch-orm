# ElasticORM

ElasticORM is an ORM tool that can run in javascript and helps developers
to define a mapping of entities in one place by using decorators.

---
**NOTE**

This is the very early release of this library. New features will be added soon.

---

## Installation
```shell
npm i elastic-orm @elastic/elasticsearch
```

## Usage

### 1. Creation of Entity
```typescript
@EsEntity('elastic_index') // specify your elastic index
export class MyEntity {
  @EsId()
  public id: string;

  @EsProperty('integer')
  public foo: number;

  @EsProperty({ type: 'keyword' })
  public bar: string;

  @EsProperty('boolean')
  public isTutorial: boolean;
}
```
