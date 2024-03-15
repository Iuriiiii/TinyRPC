import { serializables } from "../../singletons/mod.ts";
import { Constructor } from "../../types/mod.ts";
import { preserveValue, restoreValue } from "../../utils/mod.ts";

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

      serialize() {
        const result: Record<string, unknown> = {};

        for (const field in this) {
          const value = this[field];

          result[field] = preserveValue(value);
        }

        return result;
      }

      deserialize(serialized: Record<string, unknown>) {
        for (const field in serialized) {
          const value = serialized[field];

          // @ts-ignore: Update current class.
          this[field] = restoreValue(value);
        }
      }
    };

    serializables.set(Serializable, _className);
    serializables.set(_className, Serializable);

    return new Serializable();
  };
}
