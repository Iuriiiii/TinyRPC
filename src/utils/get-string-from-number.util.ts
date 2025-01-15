function someLettersToUppercase(str: string) {
  return str
    .split("")
    .map((char, index) => (char.charCodeAt(0) % 2 === 0 && index % 2 === 0 ? char.toUpperCase() : char))
    .join("");
}

/**
 * Converts a float number to an alphanumeric string.
 */
export function getStringFromNumber(value: number) {
  return someLettersToUppercase(value.toString(36).replaceAll(".", ""));
}