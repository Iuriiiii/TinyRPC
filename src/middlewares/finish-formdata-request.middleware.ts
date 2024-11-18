import { serializeValue } from "@online/bigserializer";
import { STATUS_CODE } from "jsr:http";
import type {
  FormdataRpcRequest,
  MethodExtraOptions,
} from "../interfaces/mod.ts";
import type { StopFunction } from "../types/mod.ts";

/**
 * Calls the requested method with deserialized arguments and returns result.
 * default status: `STATUS_CODE.OK` (200).
 */
export async function finishFormdataRequest(
  request: FormdataRpcRequest,
  _response: Response,
  next: StopFunction,
) {
  const { procedure, pushableArguments: args, clazz, client } = request.rpc;
  const result = (await procedure.call(
    clazz,
    ...args,
    { request, client } satisfies MethodExtraOptions<unknown>,
  )) ?? {};
  next();

  return Response.json(serializeValue({ result, updates: client }), {
    status: STATUS_CODE.OK,
  });
}
