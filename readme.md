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

### 1. Client and Repository Configuration
```typescript
import { EsRepository } from 'elastic-orm/dist/src/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';

const repository = new EsRepository(
  TestingClass,
  new Client(/* client configuration */),
);
```
Client configuration is provided here [https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/client-connecting.html](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/client-connecting.html)

### 2. Entity Definition
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

### 3. Create Mapping
You can easily create index from you entity definition by running:
```typescript
const schema =
  FactoryProvider.makeSchemaManager().generateIndexSchema(MyEntity);
await repository.createIndex(schema);
```

### Storing and Loading
```typescript
const myEntity = new MyEntity()
myEntity.foo = 99
myEntity.bar = 'hello elastic search'
myEntity.isTutorial = true
const createdEntity = await repository.create(myEntity)
```

```typescript
const res = await repository.find({
  query: {
    term: {
      foo: 99,
    },
  },
})
```

### Repository methods
#### Entity methods
- **create**: creates entity
- **createMultiple**: creates multiple entities
- **update**: updates entity
- **updateMultiple**: updates multiple entities
- **index**: index entity
- **indexMultiple**: index multiple entities
- **delete**: deletes entity
- **deleteMultiple**: deletes multiple entities
- **findOne**: finds single entity by specified query
- **findOneOrFail**: finds single entity or throw exception
- **find**: finds entities by query
- **findById** finds single entity by id

#### Indices/Mapping methods
- **createIndex**: creates index
- **deleteIndex**: delete index
- **updateMapping**: update mapping

#### Additional methods
- **on**: registers function on specific repository actions

## Advanced Usage

### Generating entity identifier
Identifier is automatically generated. But if you want to control generation of ids, you can use this approach:
```typescript
@EsEntity('elastic_index')
export class MyEntity {
  @EsId({
    generator: () => {
      return 'customGeneratedId';
    },
  })
  public id: string;
}
```

### Aliases and settings
```typescript
@EsEntity('elastic_index', {
  aliases: ['elastic_index_alias_read', 'elastic_index_alias_write'],
  settings: {
    number_of_replicas: 1,
    number_of_shards: 5,
    // and other settings definitions
  }
}) // specify your elastic index
export class MyEntity
```
