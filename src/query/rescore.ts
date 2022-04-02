export type EsReScoreType = {
  window_size: number;
  query: EsReScoreQueryType;
};

export interface EsReScoreQueryType {
  rescore_query: {
    [key: string]: any;
  };
  query_weight?: number;
  rescore_query_weight?: number;
}
