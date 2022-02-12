import { ESClassFullTypeOptionsInterface } from './EsClassTypeOptions.interface';
import {
  EsComposedPropertyOptions,
  idGenerator,
} from './EsPropertyOptions.intarface';

export interface EsPropsMetaDataInterface {
  options: EsComposedPropertyOptions;
  isNested?: boolean;
  props?: EsPropsMetaDataInterface[];
}

export interface EsMetaDataInterface {
  entity: ESClassFullTypeOptionsInterface;
  props: EsPropsMetaDataInterface[];
  idPropName: string;
  idGenerator: idGenerator;
}
