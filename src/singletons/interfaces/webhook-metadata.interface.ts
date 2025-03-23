import type { TypeAndPromise } from "../../types/mod.ts";

export interface WebhookMetadata {
  /**
   * Webhook id.
   */
  id: string;

  /**
   * Dependencies id.
   */
  dependenciesId: number;

  /**
   * The request handler.
   */
  handler(request: Request): TypeAndPromise<Response>;

  /**
   * The webhooks path.
   */
  path: string;

  /**
   * The calculated url:
   *
   * /{path}/{id}
   */
  url: string;

  /**
   * The webhooks method.
   */
  // method: Request["method"];
}
