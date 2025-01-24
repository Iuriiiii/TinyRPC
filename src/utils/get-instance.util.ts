import { isUndefined } from "@online/is";
import type { ModuleMetadata } from "../singletons/interfaces/mod.ts";
import { identifiables } from "../singletons/mod.ts";

export interface GetInstanceParam {
  moduleMetadata: ModuleMetadata;
  args?: unknown[];
  client?: Record<string, unknown>;
}

export function getInstance({ moduleMetadata, args = [], client = {} }: GetInstanceParam) {
  const { constructor: clazz } = moduleMetadata;
  const memberIdentifier = moduleMetadata.members.find((member) => member.identifier);
  const id = (() => {
    if (!memberIdentifier) {
      return;
    }

    return (
      !isUndefined(memberIdentifier.constructorParam)
        ? args?.[memberIdentifier.constructorParam]
        : client?.[memberIdentifier.name]
    ) as string | number;
  })();

  const constructInstance = () => {
    const instance = new clazz(...args) as object;

    if (id) {
      identifiables.set(id, instance);
    }

    return Object.assign(instance, client);
  };

  if (id) {
    if (!identifiables.has(id)) {
      return constructInstance();
    }

    return Object.assign(identifiables.get(id)!);
  }

  return moduleMetadata.instance ??= constructInstance();
}
