export interface EsClassTypeOptionsInterface {
  alisases?: string[];
  name?: string;
}

export interface ESClassFullTypeOptionsInterface
  extends EsClassTypeOptionsInterface {
  index: string;
}
