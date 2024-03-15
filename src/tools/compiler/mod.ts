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

function copyCoreFolder(path: string) {
  const currentPath = resolve(dirname(fromFileUrl(import.meta.url)));
  const coreFolderPath = join(currentPath, "..", "..", "core");
  const destinyFolderPath = join(path, "core");

  copySync(coreFolderPath, destinyFolderPath, {
    overwrite: true,
    preserveTimestamps: true,
  });
}

function copyModulesFolder(path: string, modulesPath: string) {
  const destinyFolderPath = join(path, "modules");

  copySync(modulesPath, destinyFolderPath, {
    overwrite: true,
    preserveTimestamps: true,
  });
}

export async function compilePackage(options: ICompilerOptions) {
  const runner = new Runner("package-compiler");
  const { packagePath, modulesPath } = options;

  runner.addStep({
    name: "Package folder creation",
    step: () => createPackageFolder(packagePath),
  });

  runner.addStep({
    name: "Copy core folder",
    step: () => copyCoreFolder(packagePath),
  });

  runner.addStep({
    name: "Copy modules folder",
    step: () => copyModulesFolder(packagePath, modulesPath),
  });

  await runner.run(true);
}
