import { decodeBase64 } from "@std/encoding";
import { unpack } from "@online/packager";

export function getModuleMembers(request: Request) {
  const header = "x-con-body";

  const base64Body = request.headers.get(header);

  if (!base64Body) {
    return {};
  }

  const decodedBody = decodeBase64(base64Body);
  const body = unpack<unknown[]>(decodedBody);

  return body;
}
