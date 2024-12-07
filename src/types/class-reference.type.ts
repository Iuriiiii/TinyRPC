// deno-lint-ignore-file no-explicit-any
export interface ClassReference<T = any> extends Function {
  new (...args: any[]): T;
}
