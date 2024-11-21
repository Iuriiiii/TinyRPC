import { modules, structures } from "../../singletons/mod.ts";
import { formatFolder, randomString, toFilename, writeFile } from "../../utils/mod.ts";
import type { ICompilerOptions } from "../interfaces/mod.ts";
import { Runner } from "../runner/mod.ts";
import { buildModule } from "./build-module.compile.ts";
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

export function compilePackage(options: ICompilerOptions) {
  const runner = new Runner("package-compiler");
  const {
    path = `${Deno.cwd()}/sdk`,
    name: packageName = `tinyrpc-sdk-${randomString()}`,
    version: packageVersion = "0.1.0",
  } = options.sdk ?? {};
  const apiPath = `${path}/api`;
  const structurePath = `${path}/structures`;

  runner.addStep({
    name: "Creating package folder...",
    step: () => createPackageFolder(path),
  });

  runner.addStep({
    name: "Creating structures folder...",
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
        structures.map((structure) => `export * from "./${toFilename(structure.name, "structure")}";`).join("\n"),
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
        modules.map((module) => `export * from "./${toFilename(module.name, "api")}";`).join("\n"),
      ),
  });

  runner.addStep({
    name: `Bulding sdk mod.ts...`,
    step: () => {
      const modApi = modules.length ? 'export * from "./api/mod.ts";' : "";
      const modStructures = structures.length ? 'export * from "./structures/mod.ts";' : "";

      writeFile(
        `${path}/mod.ts`,
        [
          modApi,
          modStructures,
          'import { configSdk } from "@tinyrpc/sdk-core";',
          'import { dateSerializer, dateDeserializer } from "@online/tinyserializers";',
          `configSdk({ host: "${options.host ?? "http://127.0.0.1/"}", https: false, serializers: [dateSerializer], deserializers: [dateDeserializer] });`,
        ].join("\n"),
      );
    },
  });

  runner.addStep({
    name: "Bulding deno.json...",
    step: () => {
      sdkDenoJson.name = packageName.toLowerCase();
      sdkDenoJson.version = packageVersion;

      writeFile(
        `${path}/deno.json`,
        JSON.stringify(sdkDenoJson, null, 4),
      );
    },
  });

  runner.addStep({
    name: "Format code",
    step: () => formatFolder(path),
  });

  return runner.run(true);
}
