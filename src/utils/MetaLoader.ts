import 'reflect-metadata';
import {
  EsIdOptions,
  EsProperty,
  EsPropertyFullOptions,
} from '../decorators/EsProperty';
import { ClassType } from '../types/Class.type';
import { EsEntity } from '../decorators/EsEntity';
import { EsMetaDataInterface } from '../types/EsMetaData.interface';
import { defaultIdGenerator } from '../entity/defaultIdGenerator';

export class MetaLoader {
  private cache = new Map<ClassType<unknown>, EsMetaDataInterface>();

  public getReflectMetaData<T = unknown>(
    Entity: ClassType<T>,
  ): EsMetaDataInterface | undefined {
    if (!this.cache.has(Entity)) {
      const props = Reflect.getMetadata(
        EsProperty.name,
        new Entity(),
      ) as EsPropertyFullOptions[];
      let idProp: EsIdOptions;
      for (const prop of props) {
        if (prop.isId) {
          idProp = prop;
          break;
        }
      }

      const meta: EsMetaDataInterface = {
        props,
        entity: Reflect.getMetadata(EsEntity.name, Entity),
        idPropName: idProp.name,
        idGenerator: idProp.generator || defaultIdGenerator,
      };

      MetaLoader.validateMetaData(Entity.name, meta);
      this.cache.set(Entity, meta);
    }

    return this.cache.get(Entity);
  }

  private static validateMetaData(
    entityName: string,
    metaData: Partial<EsMetaDataInterface>,
  ) {
    if (!metaData.idPropName) {
      throw new Error(
        `Entity ${entityName} does not have specified id property. Use @EsId decorator.`,
      );
    }
    if (!metaData || !metaData.entity || !metaData.props) {
      throw new Error(`Instance ${entityName} is not valid elastic entity`);
    }
  }

  public getIndex<T>(Entity: ClassType<T>) {
    return this.getReflectMetaData(Entity).entity.index;
  }

  public getIdPropName<T>(Entity: ClassType<T>) {
    return this.getReflectMetaData(Entity).idPropName;
  }
}
