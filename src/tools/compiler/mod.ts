import { copySync } from "deno:fs";
import { dirname, fromFileUrl, join, resolve } from "deno:path";
import { ICompilerOptions } from "../interfaces/mod.ts";
import { Runner } from "../runner/mod.ts";

function createPackageFolder(path: string) {
  try {
    Deno.removeSync(path, { recursive: true });
  } catch {}
  Deno.mkdirSync(path);
}

export async function compilePackage(options: ICompilerOptions) {
  const runner = new Runner("package-compiler");
  const { packagePath, modulesPath } = options;

  runner.addStep({
    name: "Package folder creation",
    step: () => createPackageFolder(packagePath),
  });

  await runner.run(true);
}
