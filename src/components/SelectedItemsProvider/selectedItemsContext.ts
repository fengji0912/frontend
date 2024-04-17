import { IData } from 'csl-json';
import { createContext, SetStateAction } from 'react';

import { ItemType } from '@/app/search/SavedSearches/types';

export type SelectedItemsType = {
  id: string;
  cslData: IData;
  type: ItemType;
}[];

const selectedItemsContext = createContext<{
  selectedItems: SelectedItemsType;
  setSelectedItems: (selectedItems: SetStateAction<SelectedItemsType>) => void;
}>({
  selectedItems: [],
  setSelectedItems: () => {},
});

export default selectedItemsContext;
