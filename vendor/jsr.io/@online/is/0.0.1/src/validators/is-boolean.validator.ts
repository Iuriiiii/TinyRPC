// Copyright (c) 2024 Oscar Alexander Casas
// Licensed under the Commercial Use License. For inquiries, contact alexandercasasnqn@gmail.com
export function isBoolean(value: unknown): value is boolean {
  return value === true || value === false;
}
