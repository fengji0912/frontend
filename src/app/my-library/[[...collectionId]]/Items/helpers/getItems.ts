import { searchParamsCache } from '@/app/my-library/[[...collectionId]]/searchParams';
import { initPocketbase } from '@/components/User/actions/actions';
import CACHE from '@/constants/cache';
import { Collections } from '@/types/pocketbase-types';

export default async function getItems(collectionId: string) {
  const sort = searchParamsCache.get('sort');
  const page = searchParamsCache.get('page');
  const pageSize = searchParamsCache.get('pageSize');
  const pb = await initPocketbase();
  return await pb
    .collection(Collections.CollectionItems)
    .getList(page, pageSize, {
      sort,
      filter: `collection = "${collectionId}"`,
      next: { tags: [CACHE.MY_LIBRARY_COLLECTION_ITEMS] },
    });
}
