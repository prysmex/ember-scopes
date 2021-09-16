import { assert } from '@ember/debug';
import { LocalScope, RemoteScope, IRemoteAndLocalScope } from './scope';
import { QueryGenerator, Api } from './query';

export type mode = 'remote' | 'local';

export interface WrappedClient<R> {
  [index: string]: (...args: unknown[]) => Array<R> | R;
}

export class ClientWrapper<T> {
  client: T;
  [index: string]: unknown;

  constructor(client: T) {
    this.client = client;
  }

  protected unwrapQuery(
    queryGenerator: QueryGenerator,
    mode: mode = 'remote'
  ): LocalScope | RemoteScope {
    const val = queryGenerator();
    if (
      (val as IRemoteAndLocalScope).remote ||
      (val as IRemoteAndLocalScope).local
    ) {
      if (mode === 'remote') {
        return (val as IRemoteAndLocalScope).remote;
      } else if (mode === 'local') {
        return (val as IRemoteAndLocalScope).local;
      }
    } else if (typeof val === 'function') {
      return val;
    }
    assert('Must provide a correct function');
  }

  protected localFiltering<T>(
    collection: Array<T>,
    queries: Api<T>['queries']
  ): Array<T> {
    return collection.filter((record, index) => {
      return queries.every((q) => {
        const fn = this.unwrapQuery(q, 'local') as LocalScope;
        return fn(record, index, collection);
      });
    });
  }
}
