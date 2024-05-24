'use client';

import { uniqBy } from 'lodash';
import { ChangeEvent, useContext } from 'react';

import Item from '@/components/Item/Item';
import Checkbox from '@/components/NextUi/Checkbox/Checkbox';
import SelectedItemsContext from '@/components/SelectedItemsProvider/selectedItemsContext';
import { IData } from '@/types/csl-json';
import { CollectionItemsResponse } from '@/types/pocketbase-types';

export type MetaData = {
  cslData: IData;
};

export default function ItemsList({
  items,
}: {
  items: (CollectionItemsResponse & MetaData)[];
}) {
  const { selectedItems, setSelectedItems } = useContext(SelectedItemsContext);

  const toggleSelectedItems = ({
    e,
    cslData,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    cslData: IData;
  }) =>
    setSelectedItems((items) =>
      e.target.checked
        ? [...items, { id: e.target.value, cslData, type: 'collectionItem' }]
        : items.filter((item) => item.id !== e.target.value)
    );

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems((currentItems) =>
        uniqBy(
          [
            ...currentItems,
            ...items.map((item) => ({
              id: item.id,
              cslData: item.cslData,
              type: 'collectionItem' as const,
            })),
          ],
          'id'
        )
      );
    } else {
      setSelectedItems((currentItems) =>
        currentItems.filter(
          (item) => !items.map((item) => item.id).includes(item.id)
        )
      );
    }
  };

  const isAllSelected = items.every((item) =>
    selectedItems.some((selectedItem) => selectedItem.id === item.id)
  );
  return (
    <>
      <div className="flex justify-between font-semibold mb-2">
        <div>
          <Checkbox
            className="ms-3"
            onChange={handleSelectAll}
            isSelected={isAllSelected}
          />
          Items
        </div>
        <div className="me-2">Actions</div>
      </div>
      {items.map((item) => (
        <div key={item.id} className="mb-1">
          <Item
            id={item.id}
            type="collectionItem"
            isVisibleActions
            cslData={item.cslData}
            handleCheckboxClick={toggleSelectedItems}
            checkboxChecked={selectedItems.some(
              (selectedItem) => selectedItem.id === item.id
            )}
            linkedItemId={item.linkedItemId}
          />
        </div>
      ))}
    </>
  );
}
