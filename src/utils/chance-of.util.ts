import { assert } from "@std/assert";

export function chanceOf(unaryChance: number) {
  assert(unaryChance >= 0 && unaryChance <= 1, "First argument must be between 0 and 1.");

  return Math.random() < unaryChance;
}