import { EsType } from '../types/Es.type';
import 'reflect-metadata';
import { EsFieldPropertyOptions } from '../types/EsFieldPropertyOptions.interface';
import {
  EsPropertyFullOptions,
  EsPropertyOptions,
  EsPropertyTypedOptions,
} from '../types/EsPropertyOptions.intarface';

export function EsProperty(options: EsPropertyTypedOptions): PropertyDecorator;

export function EsProperty(
  type: EsType,
  options?: EsPropertyOptions,
): PropertyDecorator;

export function EsProperty(
  option1?: EsType | EsPropertyTypedOptions,
  option2?: EsPropertyOptions,
): PropertyDecorator {
  return (target, name) => {
    const defaultOptions: EsPropertyFullOptions = {
      name: name as string,
      entityPropName: name as string,
      type: 'unknown',
      fieldOptions: {},
    };
    let propertyOptions: EsPropertyFullOptions;

    if (typeof option1 === 'string') {
      propertyOptions = Object.assign(
        defaultOptions,
        { type: option1 },
        option2 || {},
      );
    } else if (option1 instanceof Object) {
      propertyOptions = Object.assign(defaultOptions, option1);
    } else {
      throw new Error(
        `Not valid elastic property options for ${name as string}`,
      );
    }

    const properties = Reflect.getMetadata(EsProperty.name, target) || [];
    properties.push(propertyOptions);
    return Reflect.defineMetadata(EsProperty.name, properties, target);
  };
}
