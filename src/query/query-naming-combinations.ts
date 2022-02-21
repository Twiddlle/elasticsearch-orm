import { EsQuery } from './query';

class NamingPlaceHolderClass {
  public __field__;
}

const query: EsQuery<NamingPlaceHolderClass> = {
  query: {
    term: {
      __field__: '',
    },
    terms: {
      __field__: {
        index: '',
        id: '',
        path: '',
      },
    },
    match: {
      __field__: '',
    },
  },
  fields: ['__field__'],
};
