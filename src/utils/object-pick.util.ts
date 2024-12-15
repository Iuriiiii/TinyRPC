export function objectPick(value: object, keys: string[]) {
  return Object.fromEntries(Object.entries(value).filter(([key]) => keys.includes(key)));
}
