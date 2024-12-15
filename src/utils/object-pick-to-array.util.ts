// deno-lint-ignore-file
export function objectPickToArray(value: object, keys: string[]) {
  const result: any[] = [];

  for (const key of keys) {
    // @ts-ignore: Key access.
    result.push(value[key]);
  }

  return result;
}
