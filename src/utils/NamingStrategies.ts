import { namingStrategyFunction } from '../types/EsClassTypeOptions.interface';

const snakeCaseCache: Record<string, string> = {};
const camelCaseCache: Record<string, string> = {};

export const snakeCaseNamingStrategy: namingStrategyFunction = (prop) => {
  // eslint-disable-next-line no-prototype-builtins
  if (!snakeCaseCache.hasOwnProperty(prop.options.name)) {
    snakeCaseCache[prop.options.name] = prop.options.name
      .replace(/(?:^|\.?)([A-Z])/g, (x, y) => {
        return '_' + y.toLowerCase();
      })
      .replace(/^_/, '');
  }

  return snakeCaseCache[prop.options.name];
};

export const camelCaseNamingStrategy: namingStrategyFunction = (prop) => {
  // eslint-disable-next-line no-prototype-builtins
  if (!camelCaseCache.hasOwnProperty(prop.options.name)) {
    camelCaseCache[prop.options.name] = prop.options.name.replace(
      /([-_][a-z])/gi,
      ($1) => {
        return $1.toUpperCase().replace('_', '');
      },
    );
  }

  return camelCaseCache[prop.options.name];
};
