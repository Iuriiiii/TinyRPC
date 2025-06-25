import type { Constructor } from "../types/mod.ts";

const GET_MODULE_COMMENTS_REGEX = /(\/\*\*[\s\S]*?\*\/)\s*(?:public|private)?\s*(?:async)?\s*([#?\w]+)\s*\(/gm;

/**
 * Get the JSDoc comments of a class.
 *
 * @remarks
 * This function takes advantage of the fact that Javascript allows us to access the source code of a class
 * as a string with the `toString()` method. We then use a regex to extract the comments and methods
 * from the stringified class.
 *
 * @param clazz The class for which we want to get the JSDoc comments.
 * @returns A record where the keys are the method names and the values are the corresponding JSDoc comments.
 */
export function getModuleDocs(clazz: Constructor) {
  const stringifiedClass = clazz.toString();
  const result: Record<string, string> = {};

  for (const [_, comment, method] of stringifiedClass.matchAll(GET_MODULE_COMMENTS_REGEX)) {
    const _trimmedComment = comment.split("\n").map((line) => line.trim()).join("\n");
    result[method] = _trimmedComment;
  }

  return result;
}
