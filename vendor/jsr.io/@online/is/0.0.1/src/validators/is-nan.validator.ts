// Copyright (c) 2024 Oscar Alexander Casas
// Licensed under the Commercial Use License. For inquiries, contact alexandercasasnqn@gmail.com
export function isNaN(value: unknown): value is number {
  return Number.isNaN(value);
}
