import { STATUS_CODE } from "jsr:http";
import type { MethodExtraOptions, MiddlewareParam } from "../interfaces/mod.ts";
import { pack } from "@online/packager";

/**
 * Calls the requested method with deserialized arguments and returns result.
 * default status: `STATUS_CODE.OK` (200).
 */
export async function finishFormdataRequest(
  { request }: MiddlewareParam,
) {
  const { procedure, pushableArguments: args, clazz, client } = request.rpc;
  const result = (await procedure.call(
    clazz,
    ...args,
    { request, client } satisfies MethodExtraOptions<unknown>,
  )) ?? {};

  // TODO: The packets sent by the server can't be unpacked by the client.
  const packed = pack({ result, updates: client });

  return new Response(packed, {
    status: STATUS_CODE.OK,
  });
}
