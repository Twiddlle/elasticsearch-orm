import 'reflect-metadata';
import {
  ESClassFullTypeOptionsInterface,
  EsClassTypeOptionsInterface,
} from '../types/EsClassTypeOptions.interface';

export function EsEntity(
  index: string,
  options?: EsClassTypeOptionsInterface,
): ClassDecorator;
export function EsEntity(
  options: ESClassFullTypeOptionsInterface,
): ClassDecorator;

export function EsEntity(
  option1: string | ESClassFullTypeOptionsInterface,
  option2?: EsClassTypeOptionsInterface,
): ClassDecorator {
  return (target) => {
    const defaultOptions: Partial<ESClassFullTypeOptionsInterface> = {
      name: target.name,
    };
    let entityOptions: ESClassFullTypeOptionsInterface;

    if (typeof option1 === 'string') {
      entityOptions = Object.assign({ index: option1 }, option2 || {});
    } else if (option1 instanceof Object) {
      entityOptions = option1;
    } else {
      throw new Error(`Not valid elastic entity options for ${target.name}`);
    }

    entityOptions = Object.assign(defaultOptions, entityOptions);
    return Reflect.defineMetadata(EsEntity.name, entityOptions, target);
  };
}
