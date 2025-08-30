import type { MethodExtraOptions, PackArgument } from "../interfaces/mod.ts";
import type { MiddlewareParam } from "./interfaces/mod.ts";
import { STATUS_CODE } from "@std/http";
import { serialize } from "@online/miniserializer";
import { asyncLocalStorage } from "../singletons/mod.ts";

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
    const packedResult = serialize(packArgument);

    return new Response(packedResult, { status: STATUS_CODE.OK });
  });

  return result;
}
