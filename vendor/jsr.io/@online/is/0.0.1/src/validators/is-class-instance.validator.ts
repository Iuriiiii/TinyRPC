// Copyright (c) 2024 Oscar Alexander Casas
// Licensed under the Commercial Use License. For inquiries, contact alexandercasasnqn@gmail.com
import { isObject } from "./is-object.validator.ts";

export function isClassInstance(value: unknown): value is object {
  return (
    isObject(value) && !["Function", "Object"].includes(value.constructor.name)
  );
}
