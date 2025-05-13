import type { Constructor } from "../types/mod.ts";

const GET_MODULE_COMMENTS_REGEX = /(\/\*\*[\s\S]*?\*\/)\s*(?:public|private)?\s*([#?\w]+)\s*\(/gm;

export function getModuleDocs(clazz: Constructor) {
  const stringifiedClass = clazz.toString();
  const result: Record<string, string> = {};

  for (const [_, comment, method] of stringifiedClass.matchAll(GET_MODULE_COMMENTS_REGEX)) {
    const _trimmedComment = comment.split("\n").map((line) => line.trim()).join("\n");
    result[method] = _trimmedComment;
  }

  return result;
}
