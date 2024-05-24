'use server';

import { ListResult } from 'pocketbase';

import { initPocketbase } from '@/components/User/actions/actions';
import CACHE from '@/constants/cache';
import { IData } from '@/types/csl-json';
import {
  CollectionItemsResponse,
  Collections,
  CollectionsResponse,
} from '@/types/pocketbase-types';

export default async function getCollectionItemsByLinkedItemId(
  id: string
): Promise<
  ListResult<
    CollectionItemsResponse<IData, { collection: CollectionsResponse }>
  >
> {
  const page = 1;
  const pageSize = 999;

  const pb = await initPocketbase();
  return await pb
    .collection(Collections.CollectionItems)
    .getList(page, pageSize, {
      filter: `linkedItemId="${id}"`,
      expand: 'collection',
      next: { tags: [CACHE.MY_LIBRARY_COLLECTION_ITEMS + id] },
    });
}
