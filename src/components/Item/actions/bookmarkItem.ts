'use server';

import { revalidateTag } from 'next/cache';

import { initPocketbase } from '@/components/User/actions/actions';
import CACHE from '@/constants/cache';
import { getItem } from '@/services/backend';
import { CollectionItemsRecord, Collections } from '@/types/pocketbase-types';

export default async function bookmarkItem({
  itemId,
  collectionId,
}: {
  itemId: string;
  collectionId: string;
}) {
  const pb = await initPocketbase();

  const items = (
    await pb.collection(Collections.CollectionItems).getList(0, 500, {
      filter: `linkedItemId="${itemId}"`,
      next: { tags: [CACHE.MY_LIBRARY_COLLECTION_ITEMS] },
    })
  ).items;

  if (items.length > 0) {
    for (const { id } of items) {
      if (collectionId) {
        await pb
          .collection(Collections.CollectionItems)
          .update(id, { collection: collectionId });
      } else {
        await pb.collection(Collections.CollectionItems).delete(id);
      }
    }
    revalidateTag(CACHE.MY_LIBRARY_COLLECTION_ITEMS);
  } else {
    const item = await getItem(itemId);
    const data: CollectionItemsRecord = {
      cslData: item,
      collection: collectionId,
      linkedItemId: itemId.toString(),
    };

    await pb.collection(Collections.CollectionItems).create(data);
    revalidateTag(CACHE.MY_LIBRARY_COLLECTION_ITEMS);
  }
}
