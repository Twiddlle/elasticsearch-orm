export type EsFieldType<T, U = keyof T> = U | string;
export type EsFieldTypes<T, U = keyof T> = U[] | string[];

export type EsGeoPolygonType = EsGeoPointType[];

export type EsGeoPointType =
  | [number, number]
  | {
      lat: number;
      lon: number;
    }
  | string;
