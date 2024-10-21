export function buildUtils(
  host?: string,
) {
  const output = new TextDecoder()
    .decode(
      Deno.readFileSync(
        "./src/tools/compiler/assets/rpc.util.ts",
      ),
    );

  if (host) {
    return output.replace("127.0.0.1", host);
  }

  return output;
}
