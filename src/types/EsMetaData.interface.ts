import { ESClassFullTypeOptionsInterface } from './EsClassTypeOptions.interface';
import { EsPropertyFullOptions } from '../decorators/EsProperty';

export interface EsMetaDataInterface {
  entity: ESClassFullTypeOptionsInterface;
  props: EsPropertyFullOptions[];
}
