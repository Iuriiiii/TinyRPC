import { SerializedValue } from "../interfaces/mod.ts";
import {
  isClassInstance,
  isDate,
  isInfinity,
  isNaN,
  isPlainObject,
  IsPrimitive,
  randomString,
  serializables,
} from "../mod.ts";

function resolveInstance(value: unknown, instances = new Map()) {
  return {
    dataType: "instance",
    value: instances.get(value),
  } satisfies SerializedValue;
}

function serializePrimitive(value: unknown, instances = new Map()) {
  if (!isPlainObject(value)) {
    if (isNaN(value) || isInfinity(value)) {
      return null;
    }

    return value;
  }

  if (instances.has(value)) {
    return resolveInstance(value, instances);
  }

  const result: object = {};
  const referenceId: string = randomString();
  instances.set(value, referenceId);

  for (const key in value) {
    // @ts-ignore: Able array access.
    const objectValue = value[key] as unknown;

    // @ts-ignore: Able array access.
    result[key] = serializeValue(objectValue, instances);
  }

  return {
    dataType: "object",
    value: result,
    instanceId: referenceId,
  } satisfies SerializedValue;
}

export function serializeValue(value: unknown, instances = new Map()): unknown {
  if (IsPrimitive(value)) {
    return serializePrimitive(value, instances);
  } else if (isDate(value)) {
    if (instances.has(value)) {
      return resolveInstance(value, instances);
    }

    const instanceId: string = randomString();
    instances.set(value, instanceId);

    return {
      dataType: "date",
      metadata: "Date",
      instanceId,
      value: value.toISOString(),
    } satisfies SerializedValue;
  } else if (isClassInstance(value)) {
    if (!serializables.has(value.constructor)) {
      throw new Error("Non serializable data type detected.");
    }
    const instanceId: string = randomString();
    instances.set(value, instanceId);

    return {
      dataType: "class",
      // @ts-ignore: Serialize method.
      value: value.serialize(instances),
      // @ts-ignore: Get original class name.
      metadata: value.originalName,
      instanceId,
    } satisfies SerializedValue;
  } else if (value instanceof Array) {
    return value.map((item: unknown) => serializeValue(item, instances));
  }

  throw new Error("Non serializable data type detected.");
}
