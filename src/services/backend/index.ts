import ky from 'ky';
import { env } from 'next-runtime-env';

import transformBackendToJsonCsl from '@/app/[locale]/search/Results/helpers/transformCoreToJsonCsl';
import { components, operations } from '@/services/backend/types';
import { IData } from '@/types/csl-json';

const backendApi = ky.create({
  prefixUrl: env('NEXT_PUBLIC_BACKEND_URL'),
  timeout: 1000 * 60 * 5, // 5 minutes
});

export type SearchResponse = components['schemas']['QdrantDocument'];

type SearchRequest = {
  query: string;
  limit?: number;
  offset?: number;
  filter?: string;
};

export async function search({
  query,
  limit = 10,
  offset = 0,
  filter,
}: SearchRequest): Promise<
  Omit<components['schemas']['QdrantPageResponse'], 'items'> & {
    items: IData[];
  }
> {
  return backendApi
    .get('index/search', {
      searchParams: {
        query,
        limit,
        offset,
        ...(filter && { filter }),
      },
    })
    .json<components['schemas']['QdrantPagedDocumentsResponse']>()
    .then((res) => {
      return {
        ...res.payload,
        items: res.payload.items.map((item) => transformBackendToJsonCsl(item)),
      };
    });
}

export async function getItem(id: string): Promise<IData | null> {
  return backendApi
    .get(`index/get/${id}`)
    .json<components['schemas']['QdrantSingleDocumentResponse']>()
    .then((res) =>
      res?.payload ? transformBackendToJsonCsl(res.payload) : null
    )
    .catch((error) => {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    });
}

type RecommendRequest = {
  document_id: string;
  limit?: number;
  offset?: number;
};

export async function getRelatedItems({
  document_id,
  limit = 10,
  offset = 0,
}: RecommendRequest): Promise<IData[]> {
  return backendApi
    .get('index/recommend', {
      searchParams: {
        document_ids: document_id,
        limit,
        offset,
      },
    })
    .json<components['schemas']['QdrantListDocumentsResponse']>()
    .then((res) =>
      res?.payload.length > 0
        ? res?.payload.map((item) => transformBackendToJsonCsl(item))
        : []
    );
}

// export const explore = async ({
//   limit = 10,
//   offset = 0,
//   filter,
//   order_by,
// }: operations['explore_documents_index_explore_get']['parameters']['query']): Promise<
//   components['schemas']['QdrantPagedDocumentsResponse']
// > => {
//   return backendApi
//     .get('index/explore', {
//       searchParams: {
//         limit,
//         ...(offset && { offset }),
//         ...(filter && { filter }),
//         ...(order_by && { order_by }),
//       },
//     })
//     .json();
// };

export async function getCount({
  filter,
}: operations['count_documents_index_count_get']['parameters']['query'] = {}): Promise<
  components['schemas']['QdrantDictResponse'] & {
    payload: {
      count: number;
    };
  }
> {
  return backendApi
    .get('index/count', {
      searchParams: {
        ...(filter && { filter }),
      },
    })
    .json();
}

export async function getLlmExtraction({
  item_id,
  collection_item_id,
  properties,
  invalidate_cache,
}: operations['extract_item_values_llm_extract_item_values_get']['parameters']['query']): Promise<
  components['schemas']['ExtractItemValuesFromPropertiesResponse']
> {
  return backendApi
    .get('llm/extract/item/values', {
      searchParams: new URLSearchParams([
        ...properties.map((property) => ['properties', property]),
        ...(item_id ? [['item_id', item_id.toString()]] : []),
        ...(collection_item_id
          ? [['collection_item_id', collection_item_id.toString()]]
          : []),
        ...(invalidate_cache
          ? [['invalidate_cache', invalidate_cache.toString()]]
          : []),
      ]).toString(),
    })
    .json();
}

export async function synthesize({
  question,
  item_ids,
  collection_item_ids,
  invalidate_cache,
}: operations['synthesize_abstracts_for_question_llm_synthesize_items_abstracts_get']['parameters']['query']): Promise<
  components['schemas']['SynthesisAnswerOfQuestionFromAbstractsResponse']
> {
  return backendApi
    .get('llm/synthesize/items/abstracts', {
      searchParams: new URLSearchParams([
        ...(item_ids
          ? item_ids.map((itemId) => ['item_ids', itemId.toString()])
          : []),
        ...(collection_item_ids
          ? collection_item_ids.map((collectionItemId) => [
              'collection_item_ids',
              collectionItemId.toString(),
            ])
          : []),
        ['question', question],
        ...(invalidate_cache
          ? [['invalidate_cache', invalidate_cache.toString()]]
          : []),
      ]).toString(),
    })
    .json();
}

export function getBackendVersion(): Promise<
  components['schemas']['BackendVersionResponse']
> {
  return backendApi.get('backend/version').json();
}

export function getStats(): Promise<
  components['schemas']['StatisticsResponse']
> {
  return backendApi.get('backend/stats').json();
}
