import { serializeValue } from "@online/bigserializer";
import { STATUS_CODE } from "jsr:http";
import type { JsonRpcRequest, MethodExtraOptions } from "../interfaces/mod.ts";
import type { StopFunction } from "../types/mod.ts";

/**
 * Calls the requested method with deserialized arguments and returns result.
 * default status: `STATUS_CODE.OK` (200).
 */
export async function finishJsonRequest(
  request: JsonRpcRequest,
  _response: Response,
  next: StopFunction,
) {
  const { procedure, arguments: args, clazz, client } = request.rpc;
  const result = (await procedure.call(
    clazz,
    ...args,
    { request, client } satisfies MethodExtraOptions<unknown>,
  )) ?? {};
  next();
  // TODO: Complete the changes on tinyrpc-sdk-core to support updates
  return Response.json(serializeValue({ result, updates: client }), {
    status: STATUS_CODE.OK,
  });
}
