const source = `
import { deserializeValue, serializeValue } from "@online/bigserializer";

function getHost(value: string, https = false) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return "http" + (https ? "s" : "") + "://" + value;
}

const HOST = getHost("127.0.0.1");
const UE = (_: unknown, v: unknown) => v === undefined ? "[UNDFN]" : v;
const headers = { "content-type": "application/json" } as const;
const method = "POST" as const;

function getBody(value: object) {
  const body = JSON.stringify(value, UE);
  return { method, headers, body };
}

export async function rpc<T>(m: string, fn: string, args: unknown[]) {
  const _args = args.map((value) => serializeValue(value));
  const request = await fetch(HOST, getBody({ m, fn, args: _args }));

  if (!request.ok) {
    throw new Error(request.statusText);
  }

  const serialized = await request.json() as T;
  return deserializeValue<T>(serialized);
}

`.trim();

export function buildUtils(
  host?: string,
) {
  const output = source;
  // const output = new TextDecoder()
  //   .decode(
  //     Deno.readFileSync(
  //       "./src/tools/compiler/assets/rpc.util.ts",
  //     ),
  //   );

  if (host) {
    return output.replace("127.0.0.1", host);
  }

  return output;
}
