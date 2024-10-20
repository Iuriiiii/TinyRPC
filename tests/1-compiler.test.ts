import { assert } from "jsr:assert";
import { runServer } from "./utils.ts";

const exists = async (filename: string): Promise<boolean> => {
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
};

await runServer();

Deno.test("Create package folders", async (t) => {
  await t.step("Create sdk folder", async () => {
    const result = await exists("./tests/sdk");
    assert(result);
  });
});
