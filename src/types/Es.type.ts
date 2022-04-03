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

  // date
  date: Date,
  date_nanos: Date,

  // range
  integer_range: Number,
  float_range: Number,
  long_range: Number,
  double_range: Number,
  date_range: Date,
  ip_range: Number,

  // others
  binary: Buffer,
  flattened: Object,

  geo_point: Object,
  geo_shape: Object,
  point: Object,
  shape: Object,
  percolator: Object,
  ip: String,
};

export type EsType = keyof typeof ElasticSearchTypes | string;
