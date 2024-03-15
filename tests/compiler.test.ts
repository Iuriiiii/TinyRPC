import { compilePackage } from "../src/tools/mod.ts";

Deno.test("Create package folders", async (t) => {
  await t.step("Create package folder", () => {
    compilePackage({
      packagePath: Deno.cwd() + "\\tests\\package",
      modulesPath: Deno.cwd() + "\\tests\\modules",
    });
  });
});
