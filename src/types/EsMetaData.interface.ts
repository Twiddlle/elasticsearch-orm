import { ESClassFullTypeOptionsInterface } from './EsClassTypeOptions.interface';
import { EsPropertyTypedOptions } from '../decorators/EsProperty';

export interface EsMetaDataInterface {
  entity: ESClassFullTypeOptionsInterface;
  props: EsPropertyTypedOptions[];
}
