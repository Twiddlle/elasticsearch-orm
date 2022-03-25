import 'reflect-metadata';
import {
  ESClassFullTypeOptionsInterface,
  EsClassTypeOptionsInterface,
  EsIndexType,
} from '../types/EsClassTypeOptions.interface';
import { EsValidationException } from '../exceptions/EsValidationException';

export function EsEntity(
  index: EsIndexType,
  options?: EsClassTypeOptionsInterface,
): ClassDecorator;
export function EsEntity(
  options: ESClassFullTypeOptionsInterface,
): ClassDecorator;

export function EsEntity(
  option1: EsIndexType | ESClassFullTypeOptionsInterface,
  option2?: EsClassTypeOptionsInterface,
): ClassDecorator {
  return (target) => {
    const defaultOptions: Partial<ESClassFullTypeOptionsInterface> = {
      name: target.name,
      settings: {
        number_of_replicas: 0,
        number_of_shards: 1,
      },
      options: {
        refresh: 'wait_for',
      },
      mapping: {
        dynamic: 'strict',
      },
    };
    let entityOptions: ESClassFullTypeOptionsInterface;

    if (typeof option1 === 'string' || typeof option1 === 'function') {
      entityOptions = Object.assign({ index: option1 }, option2 || {});
    } else if (option1 instanceof Object) {
      entityOptions = option1;
    } else {
      throw new EsValidationException(
        `Not valid elastic entity options for ${target.name}`,
      );
    }

    entityOptions = Object.assign(defaultOptions, entityOptions);
    return Reflect.defineMetadata(EsEntity.name, entityOptions, target);
  };
}
