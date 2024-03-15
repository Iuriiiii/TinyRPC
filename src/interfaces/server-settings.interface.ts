import { Middleware } from "../types/mod.ts";

export interface ServerSettings {
  options: Deno.ServeOptions;
  packagePath?: string;
  middlewares?: Middleware[];
}
