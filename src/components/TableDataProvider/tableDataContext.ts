import { Data } from 'csl-json';
import { createContext, SetStateAction } from 'react';

import {
  CollectionItemsResponse,
  CollectionsResponse,
} from '@/types/pocketbase-types';

export type Item =
  | CollectionItemsResponse<
      Data,
      {
        collection?: CollectionsResponse | undefined;
      }
    >
  | {
      cslData: Data;
    };

export type LlmData = {
  [itemId: string]: {
    [column: string]: string | number | unknown[] | undefined;
  };
};

const tableDataContext = createContext<{
  items: Item[];
  setItems: (items: SetStateAction<Item[]>) => void;
  llmData: LlmData;
  setLlmData: (llmData: SetStateAction<LlmData>) => void;
}>({
  items: [],
  setItems: () => {},
  llmData: {},
  setLlmData: () => {},
});

export default tableDataContext;
