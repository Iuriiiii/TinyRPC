
export function Param(paramName?: string) {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    index: number
  ) {};
}
