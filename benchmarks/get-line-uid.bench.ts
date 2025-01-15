import { getLineUid } from "../src/utils/get-line-uid.util.ts";

Deno.bench("getLineUID", () => {
  getLineUid();
});
