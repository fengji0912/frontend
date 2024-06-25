import * as Original from 'csl-json';

export type IData = Original.IData & {
  custom?: {
    [k: string]: string | number | boolean | null | undefined | string[];
  };
};

export * from 'csl-json';
