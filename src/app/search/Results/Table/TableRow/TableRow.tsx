import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { Data, IData } from 'csl-json';
import { upperFirst } from 'lodash';
import { useQueryState } from 'nuqs';
import { ChangeEvent, useContext, useEffect } from 'react';
import useSWR from 'swr';

import CellLoading from '@/app/search/Results/Table/CellLoading/CellLoading';
import { ItemType } from '@/app/search/SavedSearches/types';
import {
  columnsParser,
  queryParser,
} from '@/app/search/searchParams/searchParamsParsers';
import AddToCollection from '@/components/Item/AddToCollection/AddToCollection';
import Item from '@/components/Item/Item';
import selectedItemsContext from '@/components/SelectedItemsProvider/selectedItemsContext';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
import useAuth from '@/components/User/hooks/useAuth';
import { getLlmExtraction } from '@/services/backend';
import {
  CollectionItemsResponse,
  CollectionsResponse,
} from '@/types/pocketbase-types';

type CollectionItem = CollectionItemsResponse<
  Data,
  {
    collection?: CollectionsResponse | undefined;
  }
>;

type SearchItem = {
  id: string;
  cslData: Data;
};

export type Item = {
  type: ItemType;
} & (CollectionItem | SearchItem);

type TableRowProps = {
  item: Item;
};

export default function TableRow({ item }: TableRowProps) {
  const [columns] = useQueryState('columns', columnsParser);
  const [query] = useQueryState('query', queryParser);

  const { isAuthenticated } = useAuth();

  const { data: llmData, isLoading } = useSWR(
    item.id ? [item.id, ...columns] : null,
    () =>
      getLlmExtraction({
        ...(item.type === 'searchItem' && { item_id: item.id }),
        ...(item.type === 'collectionItem' && { collection_item_id: item.id }),
        properties: [query, ...columns.slice(1)],
      })
  );

  const { selectedItems, setSelectedItems } = useContext(selectedItemsContext);

  const toggleSelectedItems = ({
    e,
    cslData,
    type,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    cslData: IData;
    type: ItemType;
  }) =>
    setSelectedItems((items) =>
      e.target.checked
        ? [...items, { id: e.target.value, cslData, type }]
        : items.filter((_item) => _item.id !== e.target.value)
    );

  const { setLlmData } = useContext(tableDataContext);

  useEffect(() => {
    if (!llmData?.payload?.values) {
      return;
    }
    setLlmData((prev) => ({
      ...prev,
      [item.id]: llmData.payload.values,
    }));
  }, [item.id, llmData, setLlmData]);

  return (
    <div
      key={item.id}
      className={`mx-3 rounded-2xl border-2 mb-2 ${
        item.type === 'collectionItem'
          ? 'border-secondary-200 bg-secondary-50'
          : 'border-secondary-100'
      }`}
    >
      <Item
        linkedItemId={
          item.type === 'collectionItem'
            ? (item as CollectionItem).linkedItemId
            : item.id
        }
        collection={
          item.type === 'collectionItem'
            ? (item as CollectionItem).expand?.collection
            : null
        }
        addToCollection={
          item.type === 'searchItem' ? (
            <AddToCollection
              itemId={item.id}
              trigger={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  isDisabled={!isAuthenticated}
                >
                  <FontAwesomeIcon icon={faBookmark} size="lg" />
                </Button>
              }
            />
          ) : null
        }
        id={item.id}
        cslData={item.cslData!}
        type={item.type}
        handleCheckboxClick={toggleSelectedItems}
        checkboxChecked={selectedItems.some(
          (selectedItem) =>
            selectedItem.id === item.id ||
            ('id' in item ? selectedItem.id === item.id : false)
        )}
      />
      <div className="flex">
        {columns.map((column) => (
          <div
            className="min-w-[300px] w-full text-sm py-3 px-4 border-r-2 border-secondary-100 break-words first:pl-[40px] last:border-r-0"
            key={column}
          >
            {isLoading ? (
              <CellLoading />
            ) : column === 'answer' ? (
              llmData?.payload?.values?.[query]?.toString() ?? ''
            ) : (
              <CellRenderer
                cell={llmData?.payload?.values?.[column]?.toString()}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CellRenderer({ cell }: { cell: string | undefined }) {
  return (
    <>
      {cell && cell.toLowerCase() !== 'unknown' ? (
        upperFirst(cell)
      ) : (
        <span className="text-secondary-700 italic">N/A</span>
      )}
    </>
  );
}
