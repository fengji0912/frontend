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

export default async function getItemsById(
  ids: string[]
): Promise<
  ListResult<
    CollectionItemsResponse<IData, { collection: CollectionsResponse }>
  >
> {
  const sort = '-created';
  const page = 1;
  const pageSize = 999;

  const pb = await initPocketbase();
  return await pb
    .collection(Collections.CollectionItems)
    .getList(page, pageSize, {
      sort,
      filter: ids.map((id) => `id="${id}"`).join('||'),
      expand: 'collection',
      next: { tags: [CACHE.MY_LIBRARY_COLLECTION_ITEMS] },
    });
}
