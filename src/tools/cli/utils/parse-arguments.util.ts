import { parseArgs } from "deno:cli";
import { Arguments } from "../interfaces/mod.ts";

export function parseArguments(args: string[] = Deno.args): Arguments {
  const booleanArgs = ["help", "build-package"];

  // All string arguments
  const stringArgs = ["generate", "name"];

  // And a list of aliases
  const alias = {
    generate: "g",
    name: "n",
  };

  const commandArgs = parseArgs(args, {
    alias,
    boolean: booleanArgs,
    string: stringArgs,
    stopEarly: false,
    "--": true,
  }) as unknown as Arguments;

  if (commandArgs["_"].length === 0) {
    commandArgs.help = true;
  }

  return commandArgs;
}
