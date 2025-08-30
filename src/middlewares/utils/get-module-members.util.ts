import { decodeBase64 } from "@std/encoding";
import { deserialize } from "@online/miniserializer";

export function getModuleMembers(request: Request) {
  const header = "x-con-body";

  const base64Body = request.headers.get(header);

  if (!base64Body) {
    return {};
  }

  const decodedBody = decodeBase64(base64Body);
  const body = deserialize<unknown[]>(decodedBody);

  return body;
}
