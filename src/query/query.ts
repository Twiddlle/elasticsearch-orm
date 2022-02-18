//todo: add more version of elastic queries 7.x, 8.x
import { TestingClass } from '../../test/fixtures/TestingClass';
import { sortTypes } from './sort';
import { FieldTypes } from './common';

export interface EsQuery<T = unknown> {
  query: {
    // populated by a global rule
  };
  profile?: boolean;
  aggs?: {
    [name: string]: {
      [type: string]: Record<string, any>;
    };
  };

  post_filter: {
    __scope_link: 'GLOBAL.filter';
  };
  size?: number;
  from?: number;
  sort?: Array<sortTypes<T>>;
  track_scores?: boolean;
  pit?: {
    id: string;
    keep_alive: 'string';
  };
  search_after?: [];
  stored_fields?: FieldTypes<T>;
  suggest: {
    __template: {
      YOUR_SUGGESTION: {
        text: 'YOUR TEXT';
        term: {
          FIELD: 'MESSAGE';
        };
      };
    };
    '*': {
      include: [];
      exclude: [];
    };
  };
  docvalue_fields: ['{field}'];
  fields: {
    __one_of: [
      [
        {
          __one_of: [
            '{field}',
            '*',
            {
              field: '{field}';
              include_unmapped: {
                __one_of: ['true', 'false'];
              };
              format: '';
            },
          ];
        },
      ],
      '*',
    ];
  };
  collapse: {
    __template: {
      field: 'FIELD';
    };
  };
  indices_boost: {
    __template: [{ INDEX: 1.0 }];
  };
  rescore: {
    __template: {
      query: Record<string, any>;
      window_size: 50;
    };
  };
  script_fields: {
    __template: {
      FIELD: {
        script: {
          // populated by a global rule
        };
      };
    };
    '*': {
      __scope_link: 'GLOBAL.script';
    };
  };
  runtime_mappings: {
    __template: {
      FIELD: {
        type: '';
        script: {
          // populated by a global rule
        };
      };
    };
    '*': {
      __scope_link: 'GLOBAL.script';
    };
  };
  partial_fields: {
    __template: {
      NAME: {
        include: [];
      };
    };
    '*': {
      include: [];
      exclude: [];
    };
  };
  highlight: {
    // populated by a global rule
  };
  _source: {
    __one_of: [
      ['{field}'],
      '*',
      '{field}',
      true,
      false,
      {
        includes: {
          __one_of: ['{field}', ['{field}']];
        };
        excludes: {
          __one_of: ['{field}', ['{field}']];
        };
      },
    ];
  };
  explain: {
    __one_of: [true, false];
  };
  stats: [''];
  timeout: '1s';
  version: { __one_of: [true, false] };
  track_total_hits: { __one_of: [true, false] };
}

const x: EsQuery<TestingClass> = {
  aggs: {},
};
