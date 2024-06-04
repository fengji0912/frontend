'use server';

import { revalidateTag } from 'next/cache';
import { ClientResponseError } from 'pocketbase';

import { redirect } from '@/components/Navigation/Navigation';
import { initPocketbase } from '@/components/User/actions/actions';
import CACHE from '@/constants/cache';
import ROUTES from '@/constants/routes';
import { Collections } from '@/types/pocketbase-types';

export async function createCollection(prevState: unknown, formData: FormData) {
  try {
    const pb = await initPocketbase();
    await pb.collection(Collections.Collections).create({
      title: formData.get('title') as string,
      user: pb.authStore.model?.id,
    });
    revalidateTag(CACHE.MY_LIBRARY_COLLECTIONS);
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return { error: error.response.message, success: false };
    }
  }
}

export async function deleteCollection(id: string) {
  try {
    const pb = await initPocketbase();
    await pb.collection(Collections.Collections).delete(id);
    revalidateTag(CACHE.MY_LIBRARY_COLLECTIONS);
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return { error: error.response.message, success: false };
    }
    throw error; // rethrow the error to ensure the redirection below is not executed
  }
  redirect(ROUTES.MY_LIBRARY);
}

export async function updateCollection({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  try {
    const pb = await initPocketbase();
    await pb.collection(Collections.Collections).update(id, {
      title,
    });
    revalidateTag(CACHE.MY_LIBRARY_COLLECTIONS);
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return { error: error.response.message, success: false };
    }
  }
}
