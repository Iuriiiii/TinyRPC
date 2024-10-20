export function undefinedDecoder(_: unknown, v: unknown) {
  return v === "[UNDFN]" ? undefined : v;
}
