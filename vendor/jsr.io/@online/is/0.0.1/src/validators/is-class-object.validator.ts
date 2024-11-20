// Copyright (c) 2024 Oscar Alexander Casas
// Licensed under the Commercial Use License. For inquiries, contact alexandercasasnqn@gmail.com
import { isObject } from "./is-object.validator.ts";

export function isClassObject(value: unknown): boolean {
  return isObject(value) && value.constructor.name === "Function";
}
