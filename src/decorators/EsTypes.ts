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
};

export type EsType = keyof typeof ElasticSearchTypes;
