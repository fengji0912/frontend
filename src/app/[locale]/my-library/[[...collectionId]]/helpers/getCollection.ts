import { notFound } from 'next/navigation';

import { redirect } from '@/components/Navigation/Navigation';
import { initPocketbase } from '@/components/User/actions/actions';
import ROUTES from '@/constants/routes';
import { Collections, CollectionsResponse } from '@/types/pocketbase-types';

export default async function getCollection(
  collectionId: string | null
): Promise<CollectionsResponse | null> {
  const pb = await initPocketbase();
  let collection = null;
  if (collectionId) {
    try {
      collection = await pb
        .collection(Collections.Collections)
        .getOne(collectionId);
    } catch (e) {
      return notFound();
    }
  } else {
    try {
      collection = await pb
        .collection(Collections.Collections)
        .getFirstListItem(`user = "${pb.authStore.model?.id}"`, {
          sort: 'title',
        });
    } catch (e) {
      return null;
    }
    if (collection?.id) {
      redirect(`${ROUTES.MY_LIBRARY}/${encodeURIComponent(collection.id)}`);
    }
  }
  return collection;
}
