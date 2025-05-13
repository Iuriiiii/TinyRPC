// deno-lint-ignore-file ban-types
import { isUndefined } from "@online/is";

function removeComments(code: string) {
  const commentRegex = /\/\/.*?(?:\r?\n|$)|\/\*[\s\S]*?\*\//g;
  return code.replace(commentRegex, '');
}

// FIXME: Avoid to catch default values on params
export function getParamName(value: Function, index: number): string;
export function getParamName(value: Function, index?: number): string[];
/**
 * Extracts parameter names from a function's signature.
 *
 * @param fn - The function whose parameter names are to be extracted.
 * @param index - Optional index of a specific parameter to retrieve. If not provided, an array of all parameter names is returned.
 *
 * @returns The name of the parameter at the specified index, or an array of all parameter names if no index is provided. Returns undefined if the parameter is not found or is a destructured object.
 */
export function getParamName(fn: Function, index?: number) {
  const stringifiedFunction = removeComments(fn.toString());
  const regex = /\((.*?)\)/g;
  const params = regex
    .exec(stringifiedFunction)![1]
    .split(",")
    .map((param) => param.trim());

  if (isUndefined(index)) {
    return params;
  }

  const argument = params[index];

  if (isUndefined(argument) || argument.startsWith("{")) {
    return;
  }

  return argument;
}
