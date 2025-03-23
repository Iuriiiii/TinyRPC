import type { MiddlewareParam } from "./interfaces/mod.ts";
import { STATUS_CODE } from "@std/http";
import { isPostRequest } from "../mod.ts";
import { crashIfNot } from "../utils/mod.ts";
import { webhooks } from "../singletons/mod.ts";
import { isRawRequest, isRawStreamRequest } from "./validators/mod.ts";
import { setRpcRequest } from "./utils/mod.ts";

/**
 * Prepare request middleware, check raw body and creates "rpc" object.
 */
export async function prepareRawRequest({ request, stop }: MiddlewareParam) {
  if (isPostRequest(request) && (isRawRequest(request) || isRawStreamRequest(request))) {
    crashIfNot(request.body, "Body not found");

    return void await setRpcRequest(request);
  }

  // TODO: Improve this to handle more methods.

  crashIfNot(isPostRequest(request), "Method not allowed");

  const url = new URL(request.url);
  const path = url.pathname;
  const webhook = webhooks.find((webhook) => webhook.url.endsWith(path));

  crashIfNot(webhook, "Webhook not found", STATUS_CODE.NotFound);
  stop();

  return webhook.handler(request);
}
