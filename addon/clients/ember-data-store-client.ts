import { RemoteScope } from 'ember-scopes/utils/scope';
import { ClientWrapper, WrappedClient } from '../utils/client';
import { mergeDeep } from '../utils/object';
import { QueryGenerator, ObjectWithScopes } from '../utils/query';

type ExtraOptions = Record<string, unknown>;

interface EmberDataWrapperClient<R> extends WrappedClient<R> {
  query(modelName: string, options: ExtraOptions): Array<R>;
  queryRecord(modelName: string, options: ExtraOptions): R;
  peekAll(modelName: string, options: ExtraOptions): Array<R>;
  peekRecord(modelName: string, id: number | string): R;
}

interface ModelKlass extends ObjectWithScopes {
  modelName: string;
}

export class EmberDataStoreClient<
  T extends EmberDataWrapperClient<R>,
  R
> extends ClientWrapper<T> {
  query(
    queries: Array<QueryGenerator>,
    klass: ModelKlass,
    opts: ExtraOptions = {}
  ): R[] {
    const modelName = klass.modelName;
    const queryOpts = queries.reduce((acum, currQuery) => {
      const currFn = this.unwrapQuery(currQuery, 'remote') as RemoteScope;
      return mergeDeep(acum, currFn());
    }, {});

    return this.client.query(modelName, {
      ...queryOpts,
      ...opts,
    });
  }

  queryRecord(
    queries: Array<QueryGenerator>,
    klass: ModelKlass,
    opts: ExtraOptions = {}
  ): R | null {
    const modelName = klass.modelName;
    const queryOpts = queries.reduce((acum, currQuery) => {
      const currFn = this.unwrapQuery(currQuery, 'remote') as RemoteScope;
      return mergeDeep(acum, currFn());
    }, {});
    return this.client.queryRecord(modelName, {
      ...queryOpts,
      ...opts,
    });
  }

  peekAll(
    queries: Array<QueryGenerator>,
    klass: ModelKlass,
    opts: ExtraOptions = {}
  ): R[] {
    const modelName = klass.modelName;
    const collection = this.client.peekAll(modelName, opts);
    return this.localFiltering(collection, queries);
  }

  peekRecord(
    queries: Array<QueryGenerator>,
    klass: ModelKlass,
    id: string | number
  ): R | null {
    const modelName = klass.modelName;
    const record = this.client.peekRecord(modelName, id);

    if (record) {
      const canBeReturned = queries.every((q, index) => {
        const fn = this.unwrapQuery(q, 'local');
        return fn(record, index, [record]);
      });

      return canBeReturned ? record : null;
    }
    return null;
  }
}
