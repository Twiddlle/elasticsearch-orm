export type FieldType<T, U = keyof T> = U | string;
export type FieldTypes<T, U = keyof T> = U[] | string[];

export type geoPolygonType = geoPointType[];

export type geoPointType =
  | [number, number]
  | {
      lat: number;
      lon: number;
    }
  | string;
