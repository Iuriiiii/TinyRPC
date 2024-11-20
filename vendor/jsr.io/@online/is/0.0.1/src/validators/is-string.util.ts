// Copyright (c) 2024 Oscar Alexander Casas
// Licensed under the Commercial Use License. For inquiries, contact alexandercasasnqn@gmail.com
export function isString(value: unknown): value is string {
  return typeof value === "string";
}
