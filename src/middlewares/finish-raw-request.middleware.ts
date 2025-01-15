import type { MethodExtraOptions, PackArgument } from "../interfaces/mod.ts";
import type { MiddlewareParam } from "./interfaces/mod.ts";
import { STATUS_CODE } from "@std/http";
import { type Encoder, pack } from "@online/packager";
import { dateSerializer } from "@online/tinyserializers";
import { asyncLocalStorage, encoders } from "../singletons/mod.ts";

const encoder: Encoder = ({ result, updates }: PackArgument) => {
  let _result = result;

  for (const _encoder of encoders) {
    _result = _encoder(_result);
  }

  return { result: _result, updates };
};

/**
 * Calls the requested method with deserialized arguments and returns result.
 * default status: `STATUS_CODE.OK` (200).
 */
export async function finishRawRequest({ request }: MiddlewareParam) {
  const { rpc } = request;
  const packed = await asyncLocalStorage.run(rpc, async () => {
    const { procedure, pushableArguments: args, clazz, client } = rpc;
    const result = (await procedure.call(clazz, ...args, { request, client } satisfies MethodExtraOptions<unknown>)) ?? {};
    const packArgument = { result, updates: client } satisfies PackArgument;

    return pack(packArgument, { serializers: [dateSerializer], encoder });
  });

  return new Response(packed, { status: STATUS_CODE.OK });
}
