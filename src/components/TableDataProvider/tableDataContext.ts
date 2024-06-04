import { createContext, SetStateAction } from 'react';

import { Item } from '@/app/[locale]/search/Results/Table/TableRow/TableRow';

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
