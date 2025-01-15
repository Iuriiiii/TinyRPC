import { PrintType } from "../enums/mod.ts";
import type { ServerSettings } from "../interfaces/mod.ts";

const PRINT_TYPE_COLOR = {
  [PrintType.Debug]: "color:rgb(43, 35, 255);",
  [PrintType.Error]: "color: #ff0000;",
  [PrintType.Information]: "color:rgb(41, 202, 223);",
  [PrintType.Log]: "color:rgb(255, 255, 255);",
  [PrintType.Warning]: "color:rgb(255, 149, 0);",
};

const PREFIX_TEXT_BY_TYPE = {
  [PrintType.Debug]: "DEBUG",
  [PrintType.Error]: "ERROR",
  [PrintType.Information]: "INFO",
  [PrintType.Log]: "LOG",
  [PrintType.Warning]: "WARN",
};

export const settings: Pick<ServerSettings, "events" | "server"> = {
  server: {},
  events: {
    onPrint({ type, args, logger, methodName, moduleName }) {
      const isModulePrint = methodName && moduleName;
      const defaultTextColor = PRINT_TYPE_COLOR[PrintType.Log];
      const messageColour = PRINT_TYPE_COLOR[type];
      const css = isModulePrint ? [messageColour, defaultTextColor, messageColour] : [messageColour, defaultTextColor];
      const format = isModulePrint ? `%c${moduleName}.${methodName}%c:%c` : `%c${PREFIX_TEXT_BY_TYPE[type]}:%c`;

      return logger(format, ...css, ...args);
    },
  },
};
