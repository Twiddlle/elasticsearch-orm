export interface EsClassTypeOptionsInterface {
  aliases?: string[];
  name?: string;
}

export interface ESClassFullTypeOptionsInterface
  extends EsClassTypeOptionsInterface {
  index: string;
}
