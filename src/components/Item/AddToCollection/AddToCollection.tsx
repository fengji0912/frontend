'use client';

import {
  PopoverContent,
  PopoverTrigger,
  Selection,
  SelectItem,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react';
import useSWR from 'swr';

import getCollections from '@/app/[locale]/my-library/[[...collectionId]]/helpers/getCollections';
import getCollectionItemsByLinkedItemId from '@/app/[locale]/search/Results/helpers/getCollectionItemsByLinkedItemId';
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Selection | null>(null);
  const t = useTranslations();

  const { data: collections } = useSWR('collections', () => getCollections());

  const { data, mutate } = useSWR('bookmarked' + itemId, () =>
    getCollectionItemsByLinkedItemId(itemId)
  );
  const bookmarkCollectionItems = data?.items;
  const [isPending, startTransition] = useTransition();

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      setSelectedKeys(keys);
      startTransition(async () => {
        await bookmarkItem({ itemId, collectionId: [...keys][0] as string });
        mutate();
      });
    },
    [itemId, mutate]
  );

  useEffect(() => {
    // set default selected collection if no collection is selected and popover is opened
    if (
      isOpen &&
      bookmarkCollectionItems &&
      bookmarkCollectionItems.length === 0 &&
      collections &&
      collections.length > 0 &&
      selectedKeys === null
    ) {
      const newSelection = new Set([collections[0].id]);
      handleSelectionChange(newSelection);
    }
  }, [
    bookmarkCollectionItems,
    collections,
    handleSelectionChange,
    isOpen,
    selectedKeys,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedKeys(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      isOpen &&
      bookmarkCollectionItems &&
      bookmarkCollectionItems.length > 0
    ) {
      setSelectedKeys(
        new Set(
          bookmarkCollectionItems?.map((item) => item.expand!.collection!.id)
        )
      );
    }
  }, [isOpen, bookmarkCollectionItems]);

  return (
    <>
      <Popover
        placement="bottom"
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      >
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
              label={t('suave_inner_quail_grip')}
              placeholder={t('short_tough_snail_pride')}
              className="w-56"
              isLoading={isPending}
              selectedKeys={selectedKeys ?? new Set([])}
              onSelectionChange={handleSelectionChange}
            >
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.title}
                </SelectItem>
              ))}
            </Select>
          ) : (
            <div className="p-3">{t('aloof_slimy_nuthatch_mend')}</div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
