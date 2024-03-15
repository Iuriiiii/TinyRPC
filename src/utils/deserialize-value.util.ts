import { isBinaryValue, serializables } from "../mod.ts";

export function deserializeValue(value: unknown, instances = new Map()) {
  if (isBinaryValue(value)) {
    const instanceId = value.instanceId;
    const className = value.metadata;
    const serializedValue = value.value;

    switch (value.dataType) {
      case "class": {
        const Serializable = serializables.get(className);
        const instance = new Serializable();

        instances.set(instanceId, instance);

        // @ts-ignore: Access to deserialize().
        return instance.deserialize(serializedValue, instances);
      }
      case "date": {
        const date = new Date(serializedValue as string);
        instances.set(instanceId, date);

        return date;
      }
      case "instance": {
        const instanceValue = instances.get(serializedValue);

        return instanceValue;
      }

      case "object": {
        const result = {};

        for (const key in serializedValue as object) {
          // @ts-ignore: Item access
          const objectValue = serializedValue[key] as unknown;
          // @ts-ignore: Item access
          result[key] = deserializeValue(objectValue, instances);
        }
        instances.set(instanceId, result);

        return result;
      }
    }
  }

  return value;
}
