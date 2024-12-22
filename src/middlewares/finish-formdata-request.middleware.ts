import type { MethodExtraOptions } from "../interfaces/mod.ts";
import type { MiddlewareParam } from "./interfaces/mod.ts";
import { STATUS_CODE } from "@std/http";
import { pack } from "@online/packager";
import { dateSerializer } from "@online/tinyserializers";

/**
 * Calls the requested method with deserialized arguments and returns result.
 * default status: `STATUS_CODE.OK` (200).
 */
export async function finishFormdataRequest(
  { request }: MiddlewareParam,
) {
  const { procedure, pushableArguments: args, clazz, client } = request.rpc;
  const result = (await procedure.call(clazz, ...args, { request, client } satisfies MethodExtraOptions<unknown>)) ?? {};
  const packed = pack({ result, updates: client }, { serializers: [dateSerializer] });

  return new Response(packed, {
    status: STATUS_CODE.OK,
  });
}
