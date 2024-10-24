import { STATUS_CODE } from "jsr:http";
import {
  finishRequest,
  getMiddlewareFunction,
  instances,
  isHttpException,
  modules,
  prepareRequest,
} from "./src/mod.ts";
import type { Middleware, ServerSettings } from "./src/mod.ts";
import { compilePackage } from "./src/tools/mod.ts";
const { serve } = Deno;

/**
 * Create instances of all classes to be used
 * on requests.
 */
function prepareClasses() {
  for (const module of modules) {
    const instance = new module.constructor();
    instances.set(instance, module.name);
    instances.set(module.name, instance);
  }
}

export class TinyRPC {
  static start({
    sdk,
    middlewares = [],
    server = {},
  }: Partial<ServerSettings> = {}) {
    prepareClasses();

    const _middlewares = [
      prepareRequest,
      ...middlewares,
      finishRequest,
    ] as Middleware[];

    const _server = serve(server, async function (request: Request) {
      let response = new Response();

      for (const _middleware of _middlewares) {
        try {
          let next = false;
          const middlewareFn = getMiddlewareFunction(_middleware);
          const result = await middlewareFn(
            request,
            response,
            () => (next = true),
          );

          if (result instanceof Response) {
            response = result;
          }

          if (!next) {
            break;
          }
        } catch (error) {
          if (isHttpException(error)) {
            return new Response(error.message, { status: error.errorCode });
          }

          // @ts-ignore: Return message
          return new Response(error.message ?? error.description ?? null, {
            status: STATUS_CODE.InternalServerError,
          });
        }
      }

      return response;
    });

    if (!sdk?.doNotGenerate) {
      compilePackage({
        sdk,
        host: `${_server.addr.hostname}:${_server.addr.port}`,
      });
    }

    return _server;
  }
}

export type { Middleware, MiddlewareObject } from "./src/mod.ts";
export { Export, Member, Module, Param, Structure } from "./src/mod.ts";
