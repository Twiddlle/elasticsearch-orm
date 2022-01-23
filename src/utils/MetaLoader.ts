import 'reflect-metadata';
import { EsProperty } from '../decorators/EsProperty';
import { ClassType } from '../types/Class.type';
import { EsEntity } from '../decorators/EsEntity';
import { EsMetaDataInterface } from '../types/EsMetaData.interface';

export class MetaLoader {
  public getReflectMetaData<T = unknown>(
    Entity: ClassType<T>,
  ): EsMetaDataInterface | undefined {
    return {
      props: Reflect.getMetadata(EsProperty.name, new Entity()),
      entity: Reflect.getMetadata(EsEntity.name, Entity),
    };
  }
}
