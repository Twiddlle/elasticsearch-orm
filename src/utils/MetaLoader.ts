import 'reflect-metadata';
import { EsProperty } from '../decorators/EsProperty';
import { ClassType } from '../types/Class.type';
import { EsEntity } from '../decorators/EsEntity';
import { EsMetaDataInterface } from '../types/EsMetaData.interface';

export class MetaLoader {
  private cache = new Map<ClassType, EsMetaDataInterface>();

  public getReflectMetaData<T = unknown>(
    Entity: ClassType<T>,
  ): EsMetaDataInterface | undefined {
    if (!this.cache.has(Entity)) {
      this.cache.set(Entity, {
        props: Reflect.getMetadata(EsProperty.name, new Entity()),
        entity: Reflect.getMetadata(EsEntity.name, Entity),
      });
    }

    return this.cache.get(Entity);
  }
}
