import { isArray } from '@ember/array';

export function isObject(val: unknown): boolean {
  return (
    val !== null &&
    typeof val === 'object' &&
    !(val instanceof Date || val instanceof RegExp) &&
    !isArray(val)
  );
}

type O = {
  [index: string]: unknown;
};

export function mergeDeep<T extends O, S extends O>(target: T, source: S): O {
  const output: O = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(
            target[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>
          );
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
