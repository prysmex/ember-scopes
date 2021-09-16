import { LocalScope, RemoteScope } from './scope';
import { QueryGenerator, Api } from './query';
export declare type mode = 'remote' | 'local';
export interface IClient {
  [index: string]: unknown;
  client: unknown;
  unwrapQuery(
    queryGenerator: QueryGenerator,
    mode: mode
  ): LocalScope | RemoteScope;
  localFiltering<T>(collection: Array<T>, queries: Api['queries']): Array<T>;
}
export declare type WrappedClient = Record<string, unknown>;
export declare class Client implements IClient {
  [k: string]: unknown;
  client: WrappedClient;
  constructor(client: WrappedClient);
  unwrapQuery(
    queryGenerator: QueryGenerator,
    mode?: mode
  ): LocalScope | RemoteScope;
  localFiltering<T>(collection: Array<T>, queries: Api['queries']): Array<T>;
}
