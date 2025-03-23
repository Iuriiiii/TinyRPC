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
export async function finishRawRequest({ request, upgradeToWebSocket }: MiddlewareParam) {
  const { rpc } = request;
  const result = await asyncLocalStorage.run(rpc, async () => {
    const { procedure, pushableArguments: args, instance } = rpc;
    const response = (await procedure.call(
      instance,
      ...args,
      { request, client: {}, upgradeToWebSocket } satisfies MethodExtraOptions<unknown>,
    )) ?? {};

    if (response instanceof ReadableStream) {
      return new Response(response, {
        status: STATUS_CODE.OK,
        headers: {
          "Content-Type": "application/octet-stream",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // FIXME: Enable updates again...
    const packArgument = { result: response, updates: {} } satisfies PackArgument;
    const packedResult = pack(packArgument, { serializers: [dateSerializer], encoder });

    return new Response(packedResult, { status: STATUS_CODE.OK });
  });

  return result;
}
