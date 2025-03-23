import { crashIf, crashIfNot } from "../../utils/mod.ts";

export function getModuleAndMethod(request: Request) {
  const header = "x-t-con";

  crashIfNot(request.headers.has(header), "Connection header not found.");

  const connection = request.headers.get(header);
  const [moduleName, methodName] = connection!.split(".");

  crashIf(!moduleName || !methodName, "Invalid connection header.");

  return { moduleName, methodName };
}
