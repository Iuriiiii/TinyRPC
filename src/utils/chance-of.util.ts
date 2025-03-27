import { crashIfNot } from "./crash-if-not.util.ts";

/**
 * Returns true with a given probability.
 * 
 * @param unaryChance The probability of returning true (0 to 1)
 * @param inclusive If true (default), uses <= comparison; if false, uses <
 * @returns boolean - true with the specified probability
 * 
 * @example
 * // 50% chance
 * if (chanceOf(0.5)) {
 *   console.log("50% chance hit");
 * }
 * 
 * @example
 * // Exactly 1 in 255 chance (exclusive)
 * if (chanceOf(1/255, false)) {
 *   console.log("1 in 255 exact chance hit");
 * }
 */
export function chanceOf(unaryChance: number): boolean {
  crashIfNot(typeof unaryChance === "number", "Probability must be a number");
  crashIfNot(unaryChance >= 0 && unaryChance <= 1, "Probability must be between 0 and 1");

  return Math.random() <= unaryChance;
}