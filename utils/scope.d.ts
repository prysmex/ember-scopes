import ComputedProperty from '@ember/object/computed';
export declare type LocalScope = (
  record: unknown,
  index: number,
  collection: Array<unknown>
) => boolean;
export declare type RemoteScope = () => Record<string, unknown>;
export interface IRemoteAndLocalScope {
  remote: RemoteScope;
  local: LocalScope;
}
export declare type Scope = (
  owner: unknown
) => IRemoteAndLocalScope | RemoteScope | LocalScope;
interface Descriptor<T> extends TypedPropertyDescriptor<T> {
  initializer?(): T;
}
export declare function scope<T>(
  target: Record<string, unknown> | Scope,
  _key?: string,
  descriptor?: Descriptor<T>
): MethodDecorator | Descriptor<Scope> | ComputedProperty<Scope, Scope> | void;
export {};
