// deno-lint-ignore-file ban-types
import { isUndefined } from "jsr:@online/is@0.0";

export function getParamName(value: Function, index: number): string;
export function getParamName(value: Function, index?: number): string[];
export function getParamName(value: Function, index?: number) {
  const regex = /\((.*?)\)/g;
  const params = regex
    .exec(value.toString())![1]
    .split(",")
    .map((param) => param.trim());

  return !isUndefined(index) ? params[index] : params;
}
