import { Arguments } from "../interfaces/mod.ts";
import { help } from "../parameters/mod.ts";

export function argumentsHandler(args: Arguments) {
  if (args.help) {
    return help();
  }
  
  
}
