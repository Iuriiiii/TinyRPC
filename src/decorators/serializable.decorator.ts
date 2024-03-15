import { serializeValue } from "../mod.ts";
import { serializables } from "../singletons/mod.ts";
import { Constructor } from "../types/mod.ts";
import { deserializeValue } from "../utils/deserialize-value.util.ts";

/**
 * Makes a class into a serializable class.
 * Use `serialize` and `deserialize`.
 *
 * @param constructor
 * @returns
 */
export function Serializable() {
  return function (constructor: Constructor) {
    const _className = constructor.name;
    const Serializable = class extends constructor {
      originalName: string = _className;

      serialize(instances = new Map()) {
        const result: Record<string, unknown> = {};

        for (const field in this) {
          const value = this[field];

          result[field] = serializeValue(value, instances);
        }

        return result;
      }

      deserialize(serialized: Record<string, unknown>, instances = new Map()) {
        for (const field in serialized) {
          const value = serialized[field];

          // @ts-ignore: Update current class.
          this[field] = deserializeValue(value, instances);
        }

        return this;
      }
    };

    serializables.set(Serializable, _className);
    serializables.set(_className, Serializable);

    // @ts-ignore: Force classes compatibility
    // deno-lint-ignore no-explicit-any
    return Serializable as any;
  };
}
