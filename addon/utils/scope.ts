import { assert } from '@ember/debug';

export type LocalScope = (
  record: unknown,
  index: number,
  collection: Array<unknown>
) => boolean;

export type RemoteScope = () => Record<string, unknown>;

export interface IRemoteAndLocalScope {
  remote: RemoteScope;
  local: LocalScope;
}

export type Scope = (
  owner: unknown,
  ...rest: Array<unknown>
) => IRemoteAndLocalScope | RemoteScope | LocalScope;

export function scope<T>(
  _target: unknown,
  _key: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
  const { value } = descriptor;

  assert(
    'Must provide a function for a scope',
    value && typeof value === 'function'
  );

  return descriptor;
}
