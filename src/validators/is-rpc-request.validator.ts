import type { RpcRequestBody } from "../interfaces/mod.ts";
import { isObject } from "./is-object.validator.ts";

export function isRpcRequest(content: unknown): content is RpcRequestBody {
  return (
    isObject(content) &&
    "m" in content &&
    "fn" in content &&
    "args" in content &&
    "mbr" in content
  );
}
