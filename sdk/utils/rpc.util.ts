import { serializeValue } from "@online/bigserializer";
const HOST = "127.0.0.1:3000";

export async function rpc<T>(m: string, fn: string, args: unknown[]) {
  const _args = args.map(serializeValue);
  const request = await fetch(`http://${HOST}/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ m, fn, args: _args }),
  });

  if (!request.ok) {
    throw new Error(request.statusText);
  }

  return request.json() as T;
}
