import { ClientWrapper } from '../utils/client';
import { QueryGenerator, ObjectWithScopes } from '../utils/query';
declare type ExtraOptions = Record<string, unknown>;
interface ModelKlass extends ObjectWithScopes {
  modelName: string;
}
export declare class EmberDataStoreClientWrapper extends ClientWrapper {
  query(
    queries: Array<QueryGenerator>,
    klass: ModelKlass,
    opts?: ExtraOptions
  ): unknown[];
  queryRecord(
    queries: Array<QueryGenerator>,
    klass: ModelKlass,
    opts?: ExtraOptions
  ): unknown;
  peekAll(
    queries: Array<QueryGenerator>,
    klass: ModelKlass,
    opts?: ExtraOptions
  ): unknown[];
  peekRecord(
    queries: Array<QueryGenerator>,
    klass: ModelKlass,
    id: string | number
  ): unknown;
}
export {};
