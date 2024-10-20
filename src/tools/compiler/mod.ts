import { modules } from "../../singletons/mod.ts";
import { randomString } from "../../utils/mod.ts";
import type { ICompilerOptions } from "../interfaces/mod.ts";
import { Runner } from "../runner/mod.ts";
import { buildModule } from "./build-module.compile.ts";
import { buildUtils } from "./build-utils.compile.ts";
import { kebabCase } from "jsr:case";
import sdkDenoJson from "./assets/deno.json" with { type: "json" };

function createPackageFolder(path: string) {
  try {
    Deno.removeSync(path, { recursive: true });
  } catch {
    // nop
  }
  Deno.mkdirSync(path);
}

function writeFile(path: string, content: string) {
  Deno.writeTextFileSync(path, content, {
    append: false,
    create: true,
    createNew: true,
  });
}

export function compilePackage(options: ICompilerOptions) {
  const runner = new Runner("package-compiler");
  const {
    path = `${Deno.cwd()}/sdk`,
    name: packageName = `tinyrpc-sdk-${randomString()}`,
    version: packageVersion = "0.1.0",
  } = options.sdk ?? {};
  const utilsPath = `${path}/utils`;
  const interfacesPath = `${path}/interfaces`;
  const apiPath = `${path}/api`;

  runner.addStep({
    name: "Creating package folder...",
    step: () => createPackageFolder(path),
  });

  runner.addStep({
    name: "Creating utils folder...",
    step: () => createPackageFolder(utilsPath),
  });

  runner.addStep({
    name: "Creating utils...",
    step: () =>
      writeFile(`${utilsPath}/rpc.util.ts`, buildUtils(options?.host)),
  });

  runner.addStep({
    name: "Creating utils...",
    step: () =>
      writeFile(`${utilsPath}/mod.ts`, 'export * from "./rpc.util.ts";'),
  });

  runner.addStep({
    name: "Creating interfaces...",
    step: () => createPackageFolder(interfacesPath),
  });

  runner.addStep({
    name: "Creating APIs...",
    step: () => createPackageFolder(apiPath),
  });

  for (const module of modules) {
    const moduleName = module.moduleName ?? module.name;
    runner.addStep({
      name: `Compiling API: ${moduleName}...`,
      step: () =>
        writeFile(
          `${apiPath}/${kebabCase(moduleName).toLowerCase()}.api.ts`,
          buildModule(module),
        ),
    });
  }

  runner.addStep({
    name: `Compiling modules mod.ts...`,
    step: () =>
      writeFile(
        `${apiPath}/mod.ts`,
        modules.map((module) =>
          `export * from "./${kebabCase(module.name)}.api.ts";`
        ).join("\n"),
      ),
  });

  runner.addStep({
    name: `Compiling sdk mod.ts...`,
    step: () => {
      const modApi = modules.length ? 'export * from "./api/mod.ts";' : "";

      writeFile(
        `${path}/mod.ts`,
        [modApi].join("\n"),
      );
    },
  });

  runner.addStep({
    name: "Compiling deno.json...",
    step: () => {
      sdkDenoJson.name = packageName;
      sdkDenoJson.version = packageVersion;

      writeFile(
        `${path}/deno.json`,
        JSON.stringify(sdkDenoJson, null, 4),
      );
    },
  });

  return runner.run(true);
}
