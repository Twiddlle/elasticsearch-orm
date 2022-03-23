import 'reflect-metadata';
import { EsProperty } from '../decorators/EsProperty';
import { ClassType } from '../types/Class.type';
import { EsEntity } from '../decorators/EsEntity';
import {
  EsMetaDataInterface,
  EsPropsMetaDataInterface,
} from '../types/EsMetaData.interface';
import { defaultIdGenerator } from '../entity/defaultIdGenerator';
import { EsComposedPropertyOptions } from '../types/EsPropertyOptions.intarface';
import {EsValidationException} from "../exceptions/EsValidationException";

export class MetaLoader {
  private static instance: MetaLoader;

  private cache = new Map<ClassType<unknown>, EsMetaDataInterface>();

  public static getInstance() {
    if (!MetaLoader.instance) {
      MetaLoader.instance = new MetaLoader();
    }

    return MetaLoader.instance;
  }

  private getEsProps<T = unknown>(
    Entity: ClassType<T>,
  ): EsPropsMetaDataInterface[] {
    const props: EsPropsMetaDataInterface[] = [];
    const entityProps =
      (Reflect.getMetadata(
        EsProperty.name,
        new Entity(),
      ) as EsComposedPropertyOptions[]) || [];

    for (const prop of entityProps) {
      const metaProp: EsPropsMetaDataInterface = {
        options: prop,
      };
      if (prop.type === 'nested') {
        metaProp.isNested = true;

        const notValidNestedErr = new EsValidationException(
          `Not valid nested entity for prop ${prop.entityPropName} in entity ${Entity.name}.`,
        );
        if (!prop.entity) {
          throw notValidNestedErr;
        }
        metaProp.props = this.getEsProps(prop.entity);
        if (metaProp.props.length === 0) {
          throw notValidNestedErr;
        }
      }
      props.push(metaProp);
    }

    return props;
  }

  public getReflectMetaData<T = unknown>(
    Entity: ClassType<T>,
  ): EsMetaDataInterface | undefined {
    if (!this.cache.has(Entity)) {
      const props = this.getEsProps(Entity);
      let idProp: EsPropsMetaDataInterface;
      for (const prop of props) {
        if (prop.options.isId) {
          if (idProp) {
            throw new EsValidationException(
              `Entity ${Entity.name} has defined multiple identifiers.`,
            );
          }
          idProp = prop;
        }
      }

      const meta: EsMetaDataInterface = {
        props,
        entity: Reflect.getMetadata(EsEntity.name, Entity),
        idPropName: idProp?.options?.entityPropName,
        idGenerator: idProp?.options?.generator || defaultIdGenerator,
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
    if (!metaData || !metaData.entity || !metaData.props) {
      throw new EsValidationException(`${entityName} is not valid elastic entity`);
    }
    if (!metaData.idPropName) {
      throw new EsValidationException(
        `Entity ${entityName} does not have specified id property. Use @EsId decorator or set isId on true.`,
      );
    }
  }

  public getIndex<T>(Entity: ClassType<T>) {
    return this.getReflectMetaData(Entity).entity.index;
  }

  public getIdPropName<T>(Entity: ClassType<T>) {
    return this.getReflectMetaData(Entity).idPropName;
  }
}
