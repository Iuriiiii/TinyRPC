// Copyright (c) 2024 Oscar Alexander Casas
// Licensed under the Commercial Use License. For inquiries, contact alexandercasasnqn@gmail.com
import { isBoolean } from "./is-boolean.validator.ts";
import { isInfinity } from "./is-infinity.validator.ts";
import { isNull } from "./is-null.validator.ts";
import { isNumber } from "./is-number.validator.ts";
import { isPlainObject } from "./is-plain-object.validator.ts";
import { isString } from "./is-string.util.ts";
import { isSymbol } from "./is-symbol.validator.ts";
import { isUndefined } from "./is-undefined.validator.ts";
import { isNaN } from "./is-nan.validator.ts";

export function IsPrimitive(value: unknown): boolean {
  return (
    isNumber(value) ||
    isString(value) ||
    isBoolean(value) ||
    isUndefined(value) ||
    isNull(value) ||
    isPlainObject(value) ||
    isSymbol(value) ||
    isInfinity(value) ||
    isNaN(value)
  );
}
