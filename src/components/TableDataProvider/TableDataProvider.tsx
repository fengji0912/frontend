'use client';

import { ReactNode, useState } from 'react';

import { Item } from '@/app/[locale]/search/Results/Table/TableRow/TableRow';
import TableDataContext, {
  LlmData,
} from '@/components/TableDataProvider/tableDataContext';

export default function TableDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [llmData, setLlmData] = useState<LlmData>({});

  return (
    <TableDataContext.Provider value={{ items, setItems, llmData, setLlmData }}>
      {children}
    </TableDataContext.Provider>
  );
}
