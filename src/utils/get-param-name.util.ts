// deno-lint-ignore-file ban-types
import { isUndefined } from "@online/is";

export function getParamName(value: Function, index: number): string;
export function getParamName(value: Function, index?: number): string[];
export function getParamName(value: Function, index?: number) {
  const regex = /\((.*?)\)/g;
  const params = regex
    .exec(value.toString())![1]
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
