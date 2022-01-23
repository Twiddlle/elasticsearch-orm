export const ElasticSearchTypes = {
  // numeric
  integer: Number,
  long: Number,
  short: Number,
  byte: Number,
  double: Number,
  float: Number,
  half_float: Number,
  scaled_float: Number,
  unsigned_long: Number,

  // boolean
  boolean: Boolean,

  //keywords
  keyword: String,
  constant_keyword: String,
  wildcard: String,

  //text
  text: String,
  match_only_text: String,
};

export type EsType = keyof typeof ElasticSearchTypes | string;
