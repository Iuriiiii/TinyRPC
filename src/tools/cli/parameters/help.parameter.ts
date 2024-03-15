export function help(): void {
  console.log(`Usage: trpg [OPTIONS...]`);
  console.log("\nOptional flags:");
  console.log("  -h, --help                Display this help and exit");
  console.log("  -n, --name                Set the new file name");
  Deno.exit(0);
}
