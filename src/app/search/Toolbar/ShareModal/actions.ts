'use server';

import { ClientResponseError } from 'pocketbase';

import { SearchData } from '@/app/search/SavedSearches/types';
import { initPocketbase } from '@/components/User/actions/actions';
import { Collections, SharedLinksResponse } from '@/types/pocketbase-types';

export async function createSharedLink(searchData: SearchData) {
  try {
    const pb = await initPocketbase();
    const sharedLink = await pb.collection(Collections.SharedLinks).create({
      searchData,
      user: pb.authStore.model?.id,
    });
    return { id: sharedLink.id };
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

export async function getSharedLink(id: string) {
  try {
    const pb = await initPocketbase();
    return pb
      .collection(Collections.SharedLinks)
      .getOne<SharedLinksResponse<SearchData>>(id);
  } catch (error) {
    console.error(error);
  }
}
