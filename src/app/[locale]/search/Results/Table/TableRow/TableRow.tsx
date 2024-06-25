import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useQueryState } from 'nuqs';
import { ChangeEvent, useContext, useEffect } from 'react';
import useSWR from 'swr';

import TableCell from '@/app/[locale]/search/Results/Table/TableRow/TableCell/TableCell';
import { ItemType } from '@/app/[locale]/search/SavedSearches/types';
import {
  columnsParser,
  queryParser,
} from '@/app/[locale]/search/searchParams/searchParamsParsers';
import AddToCollection from '@/components/Item/AddToCollection/AddToCollection';
import Item from '@/components/Item/Item';
import selectedItemsContext from '@/components/SelectedItemsProvider/selectedItemsContext';
import tableDataContext from '@/components/TableDataProvider/tableDataContext';
import useAuth from '@/components/User/hooks/useAuth';
import useLoadingTime from '@/lib/useLoadingTime';
import { getLlmExtraction } from '@/services/backend';
import { Data, IData } from '@/types/csl-json';
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

  const {
    data: llmData,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    item.id ? [item.id, ...columns] : null,
    () =>
      getLlmExtraction({
        ...(item.type === 'searchItem' && { item_id: item.id }),
        ...(item.type === 'collectionItem' && { collection_item_id: item.id }),
        properties: [query, ...columns.slice(1)],
      }),
    {
      onSuccess: () => {
        trackLoadingTime();
      },
    }
  );

  const { trackLoadingTime } = useLoadingTime({
    isValidating,
    actionLabel: 'LLM extraction loading time',
  });

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
                  aria-label="add to collection"
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
          <TableCell
            key={column}
            isLoading={isLoading}
            llmData={llmData}
            property={column === 'Answer' ? query : column}
            item={item}
            mutate={mutate}
          />
        ))}
      </div>
    </div>
  );
}
