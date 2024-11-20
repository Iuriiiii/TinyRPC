// Copyright (c) 2024 Oscar Alexander Casas
// Licensed under the Commercial Use License. For inquiries, contact alexandercasasnqn@gmail.com
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
