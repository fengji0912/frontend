'use client';

import {
  PopoverContent,
  PopoverTrigger,
  Selection,
  SelectItem,
} from '@nextui-org/react';
import { ReactElement, useEffect, useState, useTransition } from 'react';
import useSWR from 'swr';

import getCollections from '@/app/my-library/[[...collectionId]]/helpers/getCollections';
import getCollectionItemsByLinkedItemId from '@/app/search/Results/helpers/getCollectionItemsByLinkedItemId';
import bookmarkItem from '@/components/Item/actions/bookmarkItem';
import Popover from '@/components/NextUi/Popover/Popover';
import Select from '@/components/NextUi/Select/Select';

export type AddToCollectionProps = {
  itemId: string;
  trigger: ReactElement;
};

export default function AddToCollection({
  itemId,
  trigger,
}: AddToCollectionProps) {
  const { data: collections } = useSWR('collections', () => getCollections());

  const { data, mutate } = useSWR('bookmarked' + itemId, () =>
    getCollectionItemsByLinkedItemId(itemId)
  );
  const bookmarkCollectionItems = data?.items;
  const [isPending, startTransition] = useTransition();
  const [selectedKeys, setSelectedKeys] = useState<Selection>();

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
    startTransition(async () => {
      await bookmarkItem({ itemId, collectionId: [...keys][0] as string });
      mutate();
    });
  };

  useEffect(() => {
    setSelectedKeys(
      new Set(
        bookmarkCollectionItems && bookmarkCollectionItems.length > 0
          ? bookmarkCollectionItems?.map((item) => item.expand!.collection!.id)
          : []
      )
    );
  }, [bookmarkCollectionItems]);

  return (
    <Popover placement="bottom">
      <PopoverTrigger
        className={
          bookmarkCollectionItems && bookmarkCollectionItems.length > 0
            ? 'text-primary border-primary'
            : 'text-secondary border-secondary'
        }
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="py-2">
        {collections && collections.length > 0 ? (
          <Select
            label="Collection"
            placeholder="No collection selected"
            className="w-56"
            isLoading={isPending}
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
          >
            {collections.map((collection) => (
              <SelectItem key={collection.id} value={collection.id}>
                {collection.title}
              </SelectItem>
            ))}
          </Select>
        ) : (
          <div className="p-3">No collections created yet</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
