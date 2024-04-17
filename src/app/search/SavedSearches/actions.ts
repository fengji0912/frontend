'use server';

import { revalidateTag } from 'next/cache';
import { ClientResponseError, ListResult } from 'pocketbase';

import { SearchData } from '@/app/search/SavedSearches/types';
import { initPocketbase } from '@/components/User/actions/actions';
import CACHE from '@/constants/cache';
import { Collections, SavedSearchesResponse } from '@/types/pocketbase-types';

export async function getSavedSearches({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<ListResult<SavedSearchesResponse<SearchData>>> {
  const sort = '-created';

  const pb = await initPocketbase();
  return await pb
    .collection(Collections.SavedSearches)
    // page
    .getList(page, limit, {
      sort,
      next: { tags: [CACHE.SAVED_SEARCHES] },
    });
}

export async function createSavedSearch(
  searchData: SearchData,
  prevState: unknown,
  formData: FormData
) {
  try {
    const pb = await initPocketbase();

    await pb.collection(Collections.SavedSearches).create({
      title: formData.get('title') as string,
      searchData,
      user: pb.authStore.model?.id,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return {
        error: error.response.message,
        success: false,
      };
    }
  }
}

export async function deleteSavedSearch(id: string) {
  try {
    const pb = await initPocketbase();
    await pb.collection(Collections.SavedSearches).delete(id);
    revalidateTag(CACHE.SAVED_SEARCHES);
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return {
        error: error.response.message,
        success: false,
      };
    }
  }
}

export async function updateSavedSearch({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  try {
    const pb = await initPocketbase();
    await pb.collection(Collections.SavedSearches).update(id, {
      title,
    });
    revalidateTag(CACHE.SAVED_SEARCHES);
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return {
        error: error.response.message,
        success: false,
      };
    }
  }
}
