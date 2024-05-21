'use server';

import { initPocketbase } from '@/components/User/actions/actions';
import CACHE from '@/constants/cache';
import { Collections } from '@/types/pocketbase-types';

export default async function getCollections() {
  const pb = await initPocketbase();
  return pb.collection(Collections.Collections).getFullList({
    sort: 'title',
    next: { tags: [CACHE.MY_LIBRARY_COLLECTIONS] },
  });
}
