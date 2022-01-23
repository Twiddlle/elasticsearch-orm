import { EsType } from './EsTypes';
import 'reflect-metadata';

export interface EsPropertyOptions {
  analyzer?: Record<string, unknown>;
  name?: string;
}

export interface EsPropertyTypedOptions extends EsPropertyOptions {
  type: EsType;
}

export function EsProperty(options: EsPropertyTypedOptions): PropertyDecorator;

export function EsProperty(
  type: EsType,
  options?: EsPropertyTypedOptions,
): PropertyDecorator;

export function EsProperty(
  option1?: EsType | EsPropertyTypedOptions,
  option2?: EsPropertyOptions,
): PropertyDecorator {
  return (target, name) => {
    let propertyOptions: EsPropertyTypedOptions;

    if (option1 instanceof Object) {
      propertyOptions = option1;
    } else if (option2 instanceof Object) {
      propertyOptions = Object.assign({ type: option1 }, option2);
    } else {
      throw new Error('Not valid elastic property options');
    }

    Object.assign(
      {
        name: name,
      },
      propertyOptions,
    );

    const properties = Reflect.getMetadata(EsProperty.name, target) || [];
    properties.push(propertyOptions);
    return Reflect.defineMetadata(EsProperty.name, properties, target);
  };
}
