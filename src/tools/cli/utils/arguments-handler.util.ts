import { MissingArgumentException } from "../../../exceptions/mod.ts";
import { Arguments } from "../interfaces/mod.ts";
import { help } from "../parameters/mod.ts";

export function argumentsHandler(args: Arguments) {
  if (args.help) {
    return help();
  }

  if (!args._.includes("start")) {
    throw new MissingArgumentException(`Argument "start" expected.`);
  } else if (!args.modules) {
    throw new MissingArgumentException(
      `Argument "--m" or "--modules" expected.`,
    );
  }

  const modulesPath = args.modules;
}
