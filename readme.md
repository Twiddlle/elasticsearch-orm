# ElasticORM

![Package version](https://img.shields.io/npm/v/elastic-orm?label=version)
![Package downloads](https://img.shields.io/npm/dm/elastic-orm)

[//]: # (![Package types definitions]&#40;https://github.com/Twiddlle/elasticsearch-orm//actions/workflows/main.yml/badge.svg&#41;)

[//]: # (![Package types definitions]&#40;https://img.shields.io/github/issues-raw/Twiddlle/elasticsearch-orm&#41;)

[//]: # (![Top language]&#40;https://img.shields.io/github/languages/top/Twiddlle/elasticsearch-orm&#41;)

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

### 1. Entity Definition
```typescript
import { EsEntity } from 'elastic-orm/dist/decorators/EsEntity';
import { EsProperty } from 'elastic-orm/dist/decorators/EsProperty';
import { EsId } from 'elastic-orm/dist/decorators/EsId';

@EsEntity('elastic_index') // specify elastic index
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

### 2. Client and Repository Configuration
```typescript
import { EsRepository } from 'elastic-orm/dist/repository/EsRepository';
import { Client } from '@elastic/elasticsearch';

const repository = new EsRepository(
  MyEntity,
  new Client(/* client configuration */),
);
```
Client configuration is provided here [https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/client-connecting.html](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/client-connecting.html)

### 3. Create Mapping
You can easily create index from you entity definition by running:
```typescript
import { FactoryProvider } from 'elastic-orm/dist/factory/Factory.provider';

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
const {entities, raw} = await repository.find({
  query: {
    term: {
      foo: 99,
    },
  },
})
```
- **entities** contain deserialized entities.
- **raw** contains raw response from elastic.

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

### Query
#### Native query interface
Repository requires specific elastic structure object by default.
Thanks to typescript query can be written really easily with autosuggestion.
It will hint also properties from defined entity.

<img alt="autosuggestion" src="data:image/png;base64,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">

#### Query Builder
If you are more familiar with builders. Bodybuilder can be used easily.
1. Install [bodybuilder](https://www.npmjs.com/package/bodybuilder) package.
```shell
npm i bodybuilder
```
2. Builder usage
```typescript
import * as bodybuilder from 'bodybuilder';

const body = bodybuilder().query('match', 'foo', 1).build();
const res = await repository.findOne(body);
```


### Nested Entities
```typescript
import { EsEntity } from 'elastic-orm/dist/decorators/EsEntity';
import { EsProperty } from 'elastic-orm/dist/decorators/EsProperty';
import { EsId } from 'elastic-orm/dist/decorators/EsId';

@EsEntity('elastic_index')
export class MyEntity {
  @EsId()
  public id: string;

  @EsProperty('integer')
  public foo: number;

  @EsProperty({ type: 'nested', entity: MyNestedEntity })
  public nestedItem: MyNestedEntity;

  @EsProperty({ type: 'nested', entity: MyNestedEntity })
  public nestedItems: MyNestedEntity[];
}

export class MyNestedEntity {
  @EsProperty('keyword')
  public name: string;
}

// query for nested entities
const res = await repository.findOne({
  query: {
    nested: {
      path: 'nestedItem',
      query: {
        bool: {
          must: [{ match: { 'nestedItem.name': 'find this string' } }],
        },
      },
    },
  },
});
```

### Generating Entity Identifier
Identifier is automatically generated. But if you want to control generation of ids, you can use this approach:
```typescript
@EsEntity('elastic_index')
export class MyEntity {
  @EsId({
    generator: () => {
      // apply custom logic here
      return 'customGeneratedId';
    },
  })
  public id: string;
}
```

### Additional Field Options
For additional property options use parameter `additionalFieldOptions`. 
```typescript
import { EsEntity } from 'elastic-orm/dist/decorators/EsEntity';
import { EsProperty } from 'elastic-orm/dist/decorators/EsProperty';
import { EsId } from 'elastic-orm/dist/decorators/EsId';

@EsEntity('elastic_index')
export class MyEntity {
  @EsId()
  public id: string;

  @EsProperty('text', {
    additionalFieldOptions: {
      boost: 10,
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
  })
  public foo: string;
}
```

### Aliases and Settings
```typescript
@EsEntity('elastic_index', {
  aliases: ['elastic_index_alias_read', 'elastic_index_alias_write'],
  settings: {
    number_of_replicas: 1,
    number_of_shards: 5,
    // and other settings definitions
  },
  mapping: {
    dynamic: 'strict',
  },
})
export class MyEntity{}
```

### Update Mapping
```typescript
import { FactoryProvider } from 'elastic-orm/dist/factory/Factory.provider';

const mapping = FactoryProvider.makeSchemaManager().buildMapping(
  FactoryProvider.makeMetaLoader().getReflectMetaData(TestingNestedClass),
);
await repository.updateMapping(mapping);
```

### Delete Index
```typescript
await repository.deleteIndex();
```

### Global Request Manipulation
Enhancing elastic search requests is sometimes useful in one place. 
To do so you can register custom function which will be executed before every request on elastic.

For example:
1. Enable explain for non production environments
```typescript
repository.on('beforeRequest', (action, esParams, args) => {
  if (process.env.NODE_ENV !== 'production') {
    esParams.explain = true;
  }
});
```

2. In case of find method replace index for alias
```typescript
repository.on('beforeRequest', (action, esParams, args) => {
  if (action === 'find') {
    esParams.index = 'elastic_index_alias_read';
  }
});
```
