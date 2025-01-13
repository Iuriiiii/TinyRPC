import type { PrintType } from "../enums/mod.ts";
import type { TypeAndPromise } from "../types/mod.ts";

interface PrintInformation {
  // deno-lint-ignore no-explicit-any
  logger: (...args: any[]) => void;
  // deno-lint-ignore no-explicit-any
  args: any[];
  type: PrintType;
  methodName?: string;
  moduleName?: string;
}

interface ListenInformation {
  port: number;
  host: string;
}

export interface EventSettings {
  onPrint(information: PrintInformation): TypeAndPromise<void>;
  onListen(information: ListenInformation): TypeAndPromise<void>;
  onException(error: unknown): TypeAndPromise<void>;
}
