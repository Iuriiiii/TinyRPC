export function buildUtils(
  host?: string,
  currentPath = import.meta.dirname,
) {
  if (!currentPath) {
    throw new Error("No current path to build tools");
  }
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
