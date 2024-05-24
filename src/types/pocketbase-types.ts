/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
  CollectionItems = 'collectionItems',
  Collections = 'collections',
  ItemsCache = 'itemsCache',
  Pages = 'pages',
  SavedSearches = 'savedSearches',
  SharedLinks = 'sharedLinks',
  Users = 'users',
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  created: IsoDateString;
  updated: IsoDateString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type CollectionItemsRecord<TcslData = unknown> = {
  collection: RecordIdString;
  cslData?: null | TcslData;
  linkedItemId?: string;
};

export type CollectionsRecord = {
  title?: string;
  user: RecordIdString;
};

export type ItemsCacheRecord<TllmResponse = unknown> = {
  isCollectionItem?: boolean;
  itemId?: string;
  llmResponse?: null | TllmResponse;
  parameter?: string;
  promptId: string;
};

export type PagesRecord = {
  content?: HTMLString;
  title?: string;
  url: string;
};

export type SavedSearchesRecord<TsearchData = unknown> = {
  searchData: null | TsearchData;
  title?: string;
  user: RecordIdString;
};

export type SharedLinksRecord<TsearchData = unknown> = {
  searchData: null | TsearchData;
  user?: RecordIdString;
};

export type UsersRecord = {
  avatar?: string;
  name?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type CollectionItemsResponse<
  TcslData = unknown,
  Texpand = unknown,
> = Required<CollectionItemsRecord<TcslData>> & BaseSystemFields<Texpand>;
export type CollectionsResponse<Texpand = unknown> =
  Required<CollectionsRecord> & BaseSystemFields<Texpand>;
export type ItemsCacheResponse<
  TllmResponse = unknown,
  Texpand = unknown,
> = Required<ItemsCacheRecord<TllmResponse>> & BaseSystemFields<Texpand>;
export type PagesResponse<Texpand = unknown> = Required<PagesRecord> &
  BaseSystemFields<Texpand>;
export type SavedSearchesResponse<
  TsearchData = unknown,
  Texpand = unknown,
> = Required<SavedSearchesRecord<TsearchData>> & BaseSystemFields<Texpand>;
export type SharedLinksResponse<
  TsearchData = unknown,
  Texpand = unknown,
> = Required<SharedLinksRecord<TsearchData>> & BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  collectionItems: CollectionItemsRecord;
  collections: CollectionsRecord;
  itemsCache: ItemsCacheRecord;
  pages: PagesRecord;
  savedSearches: SavedSearchesRecord;
  sharedLinks: SharedLinksRecord;
  users: UsersRecord;
};

export type CollectionResponses = {
  collectionItems: CollectionItemsResponse;
  collections: CollectionsResponse;
  itemsCache: ItemsCacheResponse;
  pages: PagesResponse;
  savedSearches: SavedSearchesResponse;
  sharedLinks: SharedLinksResponse;
  users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(
    idOrName: 'collectionItems'
  ): RecordService<CollectionItemsResponse>;
  collection(idOrName: 'collections'): RecordService<CollectionsResponse>;
  collection(idOrName: 'itemsCache'): RecordService<ItemsCacheResponse>;
  collection(idOrName: 'pages'): RecordService<PagesResponse>;
  collection(idOrName: 'savedSearches'): RecordService<SavedSearchesResponse>;
  collection(idOrName: 'sharedLinks'): RecordService<SharedLinksResponse>;
  collection(idOrName: 'users'): RecordService<UsersResponse>;
};
