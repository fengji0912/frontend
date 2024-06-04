import { createContext, SetStateAction } from 'react';

import { ItemType } from '@/app/[locale]/search/SavedSearches/types';
import { IData } from '@/types/csl-json';

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
