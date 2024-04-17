'use client';

import { ReactNode, useState } from 'react';

import SelectedItemsContext, {
  SelectedItemsType,
} from '@/components/SelectedItemsProvider/selectedItemsContext';

export default function SelectedItemsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedItems, setSelectedItems] = useState<SelectedItemsType>([]);

  return (
    <SelectedItemsContext.Provider value={{ selectedItems, setSelectedItems }}>
      {children}
    </SelectedItemsContext.Provider>
  );
}
