import { EmberDataStoreClientWrapper } from './clients/ember-data-store-client-wrapper';
import { ClientWrapper } from './utils/client';
import { Query } from './utils/query';
import { mergeDeep as mergeQuery } from './utils/object';
import { scope } from './utils/scope';

export { ClientWrapper, EmberDataStoreClientWrapper, Query, mergeQuery, scope };

// Public Type Utilities
export type {
  Scope,
  IRemoteAndLocalScope,
  LocalScope,
  RemoteScope,
} from './utils/scope';
