import type { CompilerOptions } from "../interfaces/mod.ts";

export type Compiler = (options: CompilerOptions) => Promise<void>;
