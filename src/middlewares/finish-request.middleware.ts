import { serializeValue } from "@online/bigserializer";
import type { NextMiddleware, RpcRequest } from "../mod.ts";
import { STATUS_CODE } from "jsr:http";

/**
 * Calls the requested method with deserialized arguments and returns result.
 * default status: `STATUS_CODE.OK` (200).
 */
export async function finishRequest(
  request: RpcRequest,
  _response: Response,
  next: NextMiddleware,
) {
  const { procedure, arguments: args, clazz } = request.rpc;
  const result = (await procedure.call(clazz, ...args, request)) ?? {};
  next();

  return Response.json(serializeValue(result), { status: STATUS_CODE.OK });
}
