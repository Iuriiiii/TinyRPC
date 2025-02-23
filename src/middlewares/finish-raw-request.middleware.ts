import type { MethodExtraOptions, PackArgument } from "../interfaces/mod.ts";
import type { MiddlewareParam } from "./interfaces/mod.ts";
import { STATUS_CODE } from "@std/http";
import { type Encoder, pack } from "@online/packager";
import { dateSerializer } from "@online/tinyserializers";
import { asyncLocalStorage, encoders } from "../singletons/mod.ts";
import { isTransferEncodingChunk } from "./validators/mod.ts";
import { HttpError } from "../exceptions/mod.ts";
import { setRpcRequest } from "./utils/mod.ts";

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

  if (!isTransferEncodingChunk(request)) {
    const body = await request.bytes().catch(() => {
      throw new HttpError(STATUS_CODE.UnprocessableEntity, "Invalid request body");
    });

    setRpcRequest(request, body);
  } else {
    let isFirst = true;
    let timeout: number | undefined;
    const bodyReader = request.body!.getReader();
    const createTimeout = () =>
      // TODO: add settings for this interval
      timeout = setTimeout(() => bodyReader.cancel(), 60 * 1000);

    const resetTimeout = () => {
      if (timeout) {
        clearTimeout(timeout);
        createTimeout();
      }
    };

    createTimeout();

    while (true) {
      const { done, value } = await bodyReader.read();

      if (done) {
        break;
      }

      if (isFirst) {
        setRpcRequest(request, value);
      }

      resetTimeout();
      isFirst = false;
    }
  }

  const packed = await asyncLocalStorage.run(rpc, async () => {
    const { procedure, pushableArguments: args, instance, client } = rpc;
    const result = (await procedure.call(instance, ...args, { request, client } satisfies MethodExtraOptions<unknown>)) ?? {};
    const packArgument = { result, updates: client } satisfies PackArgument;

    return pack(packArgument, { serializers: [dateSerializer], encoder });
  });

  return new Response(packed, { status: STATUS_CODE.OK });
}
