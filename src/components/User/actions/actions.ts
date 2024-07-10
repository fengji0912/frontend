'use server';

import { createHash } from 'node:crypto';

import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import PocketBase, { ClientResponseError } from 'pocketbase';

import { Collections, TypedPocketBase } from '@/types/pocketbase-types';

export type User = {
  name: string;
  email: string;
  emailHash: string;
  recordId: string;
} | null;

const translateError = async (error: ClientResponseError) => {
  const t = await getTranslations();
  const errorMap: { [key: string]: string } = {
    'Something went wrong while processing your request.': t(
      'orange_blue_leopard_surge'
    ),
    'Failed to authenticate.': t('frail_lime_penguin_absorb'),
    'An error occurred while validating the form.': t(
      'maroon_red_termite_adapt'
    ),
    'Failed to create record.': t('even_spare_cat_startle'),
    validation_required: t('every_due_robin_race'),
  };

  const message = error.response.message || error.message;

  if (message in errorMap) {
    return errorMap[message];
  } else {
    return message;
  }
};

export async function initPocketbase() {
  const pb = new PocketBase(process.env.POCKETBASE_URL) as TypedPocketBase;

  // load the store data from the request cookie string
  const authCookie = cookies().get('pb_token');
  if (authCookie) {
    pb.authStore.loadFromCookie(cookies().get('pb_token')?.value || '');
  }

  return pb;
}

export async function signIn(prevState: unknown, formData: FormData) {
  try {
    const pb = await initPocketbase();
    // TODO: use signInWithEmailAndPassword instead
    await pb
      .collection(Collections.Users)
      .authWithPassword(
        formData.get('email') as string,
        formData.get('password') as string
      );

    cookies().set('pb_token', pb.authStore.exportToCookie());

    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return {
        error: await translateError(error),
        success: false,
      };
    }
  }
}

export async function signInWithEmailAndPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const pb = await initPocketbase();
  await pb.collection(Collections.Users).authWithPassword(email, password);
  cookies().set('pb_token', pb.authStore.exportToCookie());
}

export async function checkIfAuthenticated() {
  const pb = await initPocketbase();
  pb.authStore.loadFromCookie(cookies().get('pb_token')?.value || '');

  try {
    if (pb.authStore.isValid) {
      await pb.collection(Collections.Users).authRefresh();
      return true;
    }
  } catch (e) {
    pb.authStore.clear();
    return false;
  }
}

export async function getUserData(): Promise<User> {
  const pb = await initPocketbase();
  pb.authStore.loadFromCookie(cookies().get('pb_token')?.value || '');
  if (!pb.authStore.isValid) {
    return null;
  }
  await pb.collection(Collections.Users).authRefresh();

  return {
    name: pb.authStore.model?.name,
    email: pb.authStore.model?.email,
    emailHash: createHash('md5')
      .update(pb.authStore.model?.email.trim().toLowerCase())
      .digest('hex'),
    recordId: pb.authStore.model?.id,
  };
}

export async function signOut() {
  const pb = await initPocketbase();
  pb.authStore.clear();
  cookies().set('pb_token', '');
}

export async function requestPassword(prevState: unknown, formData: FormData) {
  try {
    const pb = await initPocketbase();
    await pb
      .collection(Collections.Users)
      .requestPasswordReset(formData.get('email') as string);
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return { error: await translateError(error), success: false };
    }
  }
}

export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const pb = await initPocketbase();
    await pb.collection(Collections.Users).create({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      passwordConfirm: formData.get('password') as string,
      name: formData.get('name') as string,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return {
        error: await translateError(error),
        // TODO: translate individual field errors
        data: error.response.data,
        success: false,
      };
    }
  }
}

export async function update(
  userId: string | undefined,
  prevState: unknown,
  formData: FormData
) {
  if (!userId) throw new Error('No user ID provided');
  try {
    const pb = await initPocketbase();
    await pb.collection(Collections.Users).update(userId, {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      passwordConfirm: formData.get('password') as string,
      name: formData.get('name') as string,
    });
    await pb.collection(Collections.Users).authRefresh();
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return {
        error: error.response.message ?? error.message,
        data: error.response.data,
        success: false,
      };
    }
  }
}

export async function updatePassword(
  userId: string | undefined,
  prevState: unknown,
  formData: FormData
) {
  if (!userId) throw new Error('No user ID provided');
  try {
    const pb = await initPocketbase();
    await pb.collection(Collections.Users).update(userId, {
      oldPassword: formData.get('oldPassword') as string,
      password: formData.get('password') as string,
      passwordConfirm: formData.get('passwordConfirm') as string,
    });
    await signInWithEmailAndPassword({
      email: pb.authStore.model?.email,
      password: formData.get('password') as string,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return {
        error: await translateError(error),
        data: error.response.data,
        success: false,
      };
    }
  }
}
