'use server';

import { initPocketbase } from '@/components/User/actions/actions';
import CACHE from '@/constants/cache';

export default async function getCollections() {
  const pb = await initPocketbase();
  return pb.collection('collections').getFullList({
    sort: 'title',
    next: { tags: [CACHE.MY_LIBRARY_COLLECTIONS] },
  });
}
