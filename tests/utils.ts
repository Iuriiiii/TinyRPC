function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runServer() {
  const command = new Deno.Command("deno", {
    args: ["run", "-A", "./tests/server.ts"],
  });
  const _child = command.spawn();

  await sleep(2000);
}
