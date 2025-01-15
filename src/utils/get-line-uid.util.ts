import { getStringUid } from "./get-string-uid.util.ts";

/**
 * Returns an unique number based on the line where the function is called.
 */
export function getLineUid(maxLevel = 5) {
  const stack = new Error().stack;

  if (stack) {
    const stackLines = stack
      .split("\n")
      .map((line) => line.trim());

    // Remove "Error"
    stackLines.shift();
    const limit = Math.max(maxLevel, stackLines.length);
    const truncatedStackLines = stackLines.slice(0, limit).map((line) => line.replace(/:\d+:\d+/, ""));
    let result = 0;

    for (const line of truncatedStackLines) {
      result += getStringUid(line);
    }

    return result;
  }

  return 0;
}
