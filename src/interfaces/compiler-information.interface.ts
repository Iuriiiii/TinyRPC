import type { Compiler } from "../types/mod.ts";

export interface CompilerInformation<T> {
  name: string;
  compiler: Compiler;
  custom?: T;
}
