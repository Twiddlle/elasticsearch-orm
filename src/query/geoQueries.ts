import { EsFieldType, EsGeoPointType } from './common';

export type EsGeoValidationMethodType =
  | 'IGNORE_MALFORMED'
  | 'COERCE'
  | 'STRICT';

export type EsGeoShapeRelationTypes =
  | 'INTERSECTS'
  | 'DISJOINT'
  | 'WITHIN'
  | 'CONTAINS';

export type EsGeoQueries<T> =
  | EsGeoBoundingBoxQuery<T>
  | EsGeoBoundingBoxSquareQuery<T>
  | EsGeoBoundingBoxWktQuery<T>
  | EsGeoDistanceQuery<T>
  | EsGeoPolygonQuery<T>
  | EsGeoShapeQuery<T>
  | EsGeoShapeIndexedQuery<T>;

export interface EsGeoBoundingBoxQuery<T> {
  geo_bounding_box: Record<
    EsFieldType<T>,
    {
      top_left: EsGeoPointType;
      bottom_right: EsGeoPointType;
    }
  >;
}

export interface EsGeoBoundingBoxSquareQuery<T> {
  geo_bounding_box: Record<
    EsFieldType<T>,
    {
      top: number;
      left: number;
      bottom: number;
      right: number;
    }
  >;
}

export interface EsGeoBoundingBoxWktQuery<T> {
  geo_bounding_box: Record<
    EsFieldType<T>,
    {
      wkt: string;
    }
  >;
}

export interface EsGeoDistanceQuery<T> {
  geo_distance: {
    distance: string;
    distance_type?: 'arc' | 'plane';
    _name?: string;
    [key: string]: EsGeoPointType;
    validation_method?: EsGeoValidationMethodType;
  };
}

export interface EsGeoPolygonQuery<T> {
  geo_polygon: Record<
    EsFieldType<T>,
    {
      points: Array<EsGeoPointType> &
        [EsGeoPointType, EsGeoPointType, EsGeoPointType];
      _name?: string;
      validation_method?: EsGeoValidationMethodType;
    }
  >;
}

export interface EsGeoShapeQuery<T> {
  geo_shape: Record<
    EsFieldType<T>,
    {
      shape: {
        type: 'envelope';
        coordinates: Array<EsGeoPointType>;
      };
      relation?: EsGeoShapeRelationTypes;
      ignore_unmapped?: boolean;
    }
  >;
}

export interface EsGeoShapeIndexedQuery<T> {
  geo_shape: Record<
    EsFieldType<T>,
    {
      indexed_shape: {
        id: string;
        index?: 'shapes' | string;
        path?: 'shape' | string;
        routing?: string;
      };
      relation?: EsGeoShapeRelationTypes;
      ignore_unmapped?: boolean;
    }
  >;
}
