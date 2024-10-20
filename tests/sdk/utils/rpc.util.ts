import { deserializeValue, serializeValue } from "@online/bigserializer";
const HOST = "127.0.0.1:8000";
const UE = (_: unknown, v: unknown) => v === undefined ? "[UNDFN]" : v;

export async function rpc<T>(m: string, fn: string, args: unknown[]) {
  const _args = args.map((value) => serializeValue(value));
  const body = JSON.stringify({ m, fn, args: _args }, UE);
  const request = await fetch(`http://${HOST}/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const serialized = await request.json() as T;
  return deserializeValue<T>(serialized);
}
