import { Scope } from './scope';

const QUERY_KEY = 'queries';

export type QueryGenerator = () => ReturnType<Scope>;

export interface ObjectWithScopes {
  [index: string]: unknown | Scope;
}

export type Api<T> = {
  queries: Array<QueryGenerator>;
  where(fn: Scope): ReturnType<Scope>;
  client: T;
};

export function Query<
  T extends { [index: string]: unknown },
  K extends { [index: string]: unknown }
>(owner: unknown, client: T, klass: K): Record<string, unknown> {
  const api: Api<T> = {
    [QUERY_KEY]: [],

    where(fn: Scope) {
      return fn(owner);
    },

    client,
  };

  return new Proxy(
    {},
    {
      get(_target, key: string, receiver) {
        if (key === QUERY_KEY) {
          return api[QUERY_KEY];
        }
        const isFinisher = api.client[key];
        const isWhere = key === 'where';

        const val = Reflect.get(klass, key);
        return function (...args: Array<unknown>) {
          let resp: QueryGenerator;

          if (isFinisher && typeof isFinisher === 'function') {
            return isFinisher.apply(client, [api[QUERY_KEY], klass, ...args]);
          }
          if (isWhere) {
            resp = () => {
              return api.where(args[0] as Scope);
            };
          } else {
            resp = () => {
              return val(owner, ...args);
            };
          }
          api[QUERY_KEY].push(resp);
          return receiver;
        };
      },
    }
  );
}
