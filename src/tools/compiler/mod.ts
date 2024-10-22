import { modules, structures } from "../../singletons/mod.ts";
import { randomString, toFilename } from "../../utils/mod.ts";
import type { ICompilerOptions } from "../interfaces/mod.ts";
import { Runner } from "../runner/mod.ts";
import { buildModule } from "./build-module.compile.ts";
import { buildUtils } from "./build-utils.compile.ts";
import sdkDenoJson from "./assets/deno.json" with { type: "json" };
import { buildStructure } from "./build-structure.compile.ts";

function createPackageFolder(path: string) {
  try {
    Deno.removeSync(path, { recursive: true });
  } catch {
    // nop
  }
  Deno.mkdirSync(path);
}

function writeFile(path: string, content: string) {
  try {
    Deno.writeTextFileSync(path, content, {
      append: false,
      create: true,
      createNew: true,
    });
  } catch (error) {
    console.warn(
      `Error writting file "${path}", content length: ${content.length}`,
    );
    throw error;
  }
}

export function compilePackage(options: ICompilerOptions) {
  const runner = new Runner("package-compiler");
  const {
    path = `${Deno.cwd()}/sdk`,
    name: packageName = `tinyrpc-sdk-${randomString()}`,
    version: packageVersion = "0.1.0",
  } = options.sdk ?? {};
  const utilsPath = `${path}/utils`;
  const apiPath = `${path}/api`;
  const structurePath = `${path}/structures`;

  runner.addStep({
    name: "Creating package folder...",
    step: () => createPackageFolder(path),
  });

  runner.addStep({
    name: "Creating utils folder...",
    step: () => createPackageFolder(utilsPath),
  });

  runner.addStep({
    name: "Creating util files...",
    step: () =>
      writeFile(`${utilsPath}/rpc.util.ts`, buildUtils(options?.host)),
  });

  runner.addStep({
    name: `Bulding utils mod.ts...`,
    step: () =>
      writeFile(`${utilsPath}/mod.ts`, 'export * from "./rpc.util.ts";'),
  });

  runner.addStep({
    name: "Creating structure folder...",
    step: () => createPackageFolder(structurePath),
  });

  for (const structure of structures) {
    const { name: structureName } = structure;
    runner.addStep({
      name: `Building structure: ${structureName}...`,
      step: () =>
        writeFile(
          `${structurePath}/${toFilename(structureName, "structure")}`,
          buildStructure(structure),
        ),
    });
  }

  runner.addStep({
    name: `Bulding structures mod.ts...`,
    step: () =>
      writeFile(
        `${structurePath}/mod.ts`,
        structures.map((structure) =>
          `export * from "./${toFilename(structure.name, "structure")}";`
        ).join("\n"),
      ),
  });

  runner.addStep({
    name: "Creating APIs folder...",
    step: () => createPackageFolder(apiPath),
  });

  for (const module of modules) {
    const moduleName = module.moduleName ?? module.name;
    runner.addStep({
      name: `Bulding API: ${moduleName}...`,
      step: () =>
        writeFile(
          `${apiPath}/${toFilename(moduleName, "api")}`,
          buildModule(module),
        ),
    });
  }

  runner.addStep({
    name: `Bulding modules mod.ts...`,
    step: () =>
      writeFile(
        `${apiPath}/mod.ts`,
        modules.map((module) =>
          `export * from "./${toFilename(module.name, "api")}";`
        ).join("\n"),
      ),
  });

  runner.addStep({
    name: `Bulding sdk mod.ts...`,
    step: () => {
      const modApi = modules.length ? 'export * from "./api/mod.ts";' : "";

      writeFile(
        `${path}/mod.ts`,
        [modApi].join("\n"),
      );
    },
  });

  runner.addStep({
    name: "Bulding deno.json...",
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
