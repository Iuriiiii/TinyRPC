import { isUndefined } from "@online/is";
import type { ModuleMetadata } from "../singletons/interfaces/mod.ts";
import { identifiables } from "../singletons/mod.ts";

export interface GetModuleInstanceParam {
  moduleMetadata: ModuleMetadata;
  args?: unknown[];
  client?: Record<string, unknown>;
}

// FIXME: Is retreiving the same instance for many different unique ids
export function getModuleInstance({ moduleMetadata, args = [], client = {} }: GetModuleInstanceParam) {
  const { constructor: clazz } = moduleMetadata;
  const memberIdentifier = moduleMetadata.members.find((member) => member.identifier);
  const expectedClassId = (() => {
    if (!memberIdentifier) {
      return;
    }

    // If the identifier member is a constructor param then use that value to identify the instance.
    return (
      !isUndefined(memberIdentifier.constructorParam)
        ? args?.[memberIdentifier.constructorParam]
        : client?.[memberIdentifier.name]
    ) as string | number;
  })();

  /**
   * Create a new class instance and add it to local database.
   */
  const constructInstance = () => {
    const instance = new clazz(...args) as object;

    if (expectedClassId) {
      identifiables.set(expectedClassId, instance);
    }

    return Object.assign(instance, client);
  };

  if (expectedClassId) {
    if (!identifiables.has(expectedClassId)) {
      return constructInstance();
    }

    return identifiables.get(expectedClassId)!;
  }

  return constructInstance();
}
