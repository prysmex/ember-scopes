import { IClient } from './client';
import { Scope } from './scope';
export declare type QueryGenerator = () => ReturnType<Scope>;
export declare type ObjectWithScopes = Record<string, unknown>;
export declare type Api = {
  queries: Array<QueryGenerator>;
  where(fn: Scope): ReturnType<Scope>;
  client: IClient;
};
export declare function Query(
  owner: unknown,
  client: IClient,
  klass: ObjectWithScopes
): Record<string, unknown>;
