// Copyright (c) 2024 Oscar Alexander Casas
// Licensed under the Commercial Use License. For inquiries, contact alexandercasasnqn@gmail.com
import { isNumber } from "./is-number.validator.ts";

export function isInfinity(value: unknown): value is number {
  return isNumber(value) && (value === Infinity || value === -Infinity);
}
