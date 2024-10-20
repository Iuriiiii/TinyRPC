import { resolve } from "jsr:path";

export function buildUtils(host?: string) {
  const currentPath = import.meta.dirname!;
  const output = new TextDecoder()
    .decode(
      Deno.readFileSync(
        `${resolve(currentPath)}/assets/rpc.util.ts`,
      ),
    );

  if (host) {
    return output.replace("127.0.0.1", host);
  }

  return output;
}
