import { assert } from "@std/assert";
import { settings, webhooks } from "../singletons/mod.ts";
import { getArrayUid } from "./get-array-uid.util.ts";
import { getFunctionUid } from "./get-function-uid.util.ts";
import { getStringFromNumber } from "./get-string-from-number.util.ts";
import { getFullUrl } from "./get-full-url.util.ts";

export interface CreateWebhookParam {
  handler(request: Request): Response;
  /**
   * The webhook path.
   *
   * If path is `undefined` or empty, then the path will be:
   * `/webhooks/{id}`
   *
   * If path is `/`, then the path will be:
   * `/{id}`
   *
   * If path is `/notifications`, then the path will be:
   * `/notifications/{id}`
   */
  path?: string;
  id?: string;
  dependencies?: unknown[];
}

export interface CreateWebhookResponse {
  id: string;
  url: string;
}

/**
 * Creates a new webhook to handle requests.
 */
export function createWebhook(param: CreateWebhookParam): CreateWebhookResponse {
  assert(settings.server, "The server must be running before creating webhooks.");

  const { id, handler, dependencies = [], path = "/webhooks" } = param;
  const dependenciesId = getArrayUid(dependencies);
  const uid = id ?? getStringFromNumber(getFunctionUid(handler) + dependenciesId);
  const webhook = webhooks.find((webhook) => webhook.id === uid);

  if (webhook) {
    return {
      id: webhook.id,
      url: webhook.url,
    };
  }

  const url = getFullUrl({
    host: settings.server.hostname!,
    port: settings.server.port,
    https: settings.server.hostname?.startsWith("https://"),
    path: (!path ? `/webhooks/${uid}` : path === "/" ? `/${uid}` : `${path}/${uid}`),
  });

  webhooks.push({
    id: uid,
    dependenciesId,
    path,
    url,
    handler,
  });

  return {
    id: uid,
    url,
  };
}
