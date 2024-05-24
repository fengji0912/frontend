'use server';

import '@citation-js/plugin-bibtex';
import '@citation-js/plugin-csl';
import '@citation-js/plugin-doi';

import { Cite } from '@citation-js/core';
import { capitalize, omit } from 'lodash';
import { revalidateTag } from 'next/cache';
import { ClientResponseError } from 'pocketbase';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { v4 as uuid } from 'uuid';

import { FIELDS } from '@/app/my-library/[[...collectionId]]/Items/ItemsModal/constants/fields';
import { OptionType } from '@/app/my-library/[[...collectionId]]/Items/Title/TitleModal';
import { initPocketbase } from '@/components/User/actions/actions';
import CACHE from '@/constants/cache';
import { getItem, search } from '@/services/backend';
import {
  DateFieldKey,
  IData,
  Person,
  PersonFieldKey,
  StringFieldKey,
} from '@/types/csl-json';
import { CollectionItemsRecord, Collections } from '@/types/pocketbase-types';

function prepareMetaData(formData: FormData) {
  const cslData: IData = {
    id: uuid(),
    type: 'article',
  };
  // only accept cslType keys
  const cslKeys: (keyof IData)[] = [
    ...(formData.keys() as unknown as (keyof IData)[]),
  ].filter((key) => FIELDS.map((field) => field.cslType).includes(key));
  for (const cslType of cslKeys) {
    const value = formData.getAll(cslType);

    if (value) {
      const inputType = FIELDS.find((field) => field.cslType === cslType)?.type;
      if (inputType === 'date' && value[1]) {
        cslData[cslType as DateFieldKey] = {
          'date-parts': [
            [
              parseInt(value[1] as string),
              value[0] ? parseInt(value[0] as string) : undefined,
            ],
          ],
        };
        continue;
      }
      if (inputType === 'person') {
        const authors: Person[] = JSON.parse(value?.[0] as string).map(
          (author: { id: string; person: Person }) => {
            return author.person;
          }
        );
        cslData[cslType as PersonFieldKey] = authors;
        continue;
      }
      cslData[cslType as StringFieldKey] = value[0] as string;
    }
  }
  return cslData;
}

export async function createCollectionItem(
  collectionId: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    const pb = await initPocketbase();
    const cslData = prepareMetaData(formData);

    const data: CollectionItemsRecord = {
      cslData,
      collection: collectionId,
    };

    await pb.collection(Collections.CollectionItems).create(data);
    revalidateTag(CACHE.MY_LIBRARY_COLLECTION_ITEMS);
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return {
        error: error.response.message,
        success: false,
        data: error.response.data,
      };
    }
  }
}

export async function updateCollectionItem(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    const pb = await initPocketbase();
    const cslData = prepareMetaData(formData);

    const data: Partial<CollectionItemsRecord<IData>> = {
      cslData,
    };

    await pb.collection(Collections.CollectionItems).update(id, data);
    revalidateTag(CACHE.MY_LIBRARY_COLLECTION_ITEMS);
    return { success: true };
  } catch (error) {
    console.error(error);
    if (error instanceof ClientResponseError) {
      return {
        error: error.response.message,
        success: false,
        data: error.response.data,
      };
    }
  }
}

export async function deleteCollectionItem(id: string) {
  try {
    const pb = await initPocketbase();
    await pb.collection(Collections.CollectionItems).delete(id);
    revalidateTag(CACHE.MY_LIBRARY_COLLECTION_ITEMS);
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

export async function deleteCollectionItems(ids: string[]) {
  try {
    const pb = await initPocketbase();
    const promises = ids.map((id) =>
      pb.collection(Collections.CollectionItems).delete(id)
    );
    await Promise.all(promises);

    revalidateTag(CACHE.MY_LIBRARY_COLLECTION_ITEMS);
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

export async function importItem(
  collectionId: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    const pb = await initPocketbase();

    const items = await Cite.async(formData.get('importString') as string);

    for (const item of items?.data) {
      const data: CollectionItemsRecord<IData> = {
        collection: collectionId,
        cslData: omit(item, '_graph'),
      };
      await pb.collection(Collections.CollectionItems).create(data);
    }
    revalidateTag(CACHE.MY_LIBRARY_COLLECTION_ITEMS);
    return { success: true };
  } catch (error) {
    console.error(error);
    if (
      error instanceof Error &&
      (error.message?.includes('invalid syntax') ||
        error.message?.includes('format is not supported'))
    ) {
      return {
        error: capitalize(error.message),
        success: false,
      };
    } else if (error instanceof ClientResponseError) {
      return {
        error: error.response.message,
        success: false,
      };
    }
    return {
      error: 'An error occurred, please check your input and try again.',
      success: false,
    };
  }
}

export async function createCollectionItemByTitle(
  collectionId: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    const pb = await initPocketbase();

    const linkedItemId = formData.get('linkedItemId') as string;
    if (!linkedItemId) {
      throw new Error('Item ID is required');
    }

    const item = await getItem(linkedItemId);
    const data: CollectionItemsRecord<IData> = {
      linkedItemId,
      collection: collectionId,
      cslData: item,
    };

    await pb.collection(Collections.CollectionItems).create(data);
    revalidateTag(CACHE.MY_LIBRARY_COLLECTION_ITEMS);
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error: 'An error occurred, please check your input and try again.',
      success: false,
    };
  }
}

export async function titleLookup(
  q: string,
  _: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
  additional:
    | {
        page: number;
      }
    | undefined
) {
  const pageSize = 20;
  const page = additional?.page ?? 1;
  const items = await search({
    query: `title: "${q}"`,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
  return {
    options: items.items.map((item) => ({
      value: item.id.toString(),
      label: item.title,
    })),
    hasMore: items.has_more,
    additional: {
      page: page + 1,
    },
  };
}
