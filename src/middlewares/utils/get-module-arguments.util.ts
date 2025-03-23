import type { ModuleMetadata } from "../../singletons/interfaces/mod.ts";
import { crashIf } from "../../utils/mod.ts";
import { decodeBase64 } from "@std/encoding";
import { unpack } from "@online/packager";

export function getModuleArguments(request: Request, _moduleMetadata: ModuleMetadata) {
  const header = "x-t-arg";

  crashIf(!request.headers.has(header), "Arguments header not found.");

  const base64Args = request.headers.get(header)!;

  crashIf(!base64Args, "Invalid arguments header.");

  const decodedArgs = decodeBase64(base64Args);
  const args = unpack<unknown[]>(decodedArgs);

  return args;
}
