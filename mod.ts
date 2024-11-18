import { STATUS_CODE } from "jsr:http";
import {
  getMiddlewareFunction,
  instances,
  isHttpException,
  modules,
  prepareFormdataRequest,
} from "./src/mod.ts";
import type { Middleware, ServerSettings } from "./src/mod.ts";
import { compilePackage } from "./src/tools/mod.ts";
import { finishFormdataRequest } from "./src/middlewares/mod.ts";
const { serve } = Deno;

/**
 * Create instances of all classes to be used
 * on requests.
 */
function prepareClasses() {
  for (const module of modules) {
    module.instance = new module.constructor();
    instances.set(module.name, module);
    instances.set(module, module.name);
  }
}

/**
 * TinyRPC main class.
 */
export class TinyRPC {
  /**
   * Starts an HTTP(s) server to start processing RPC requests.
   */
  static start(param: Partial<ServerSettings> = {}) {
    const { sdk, middlewares = [], server = {} } = param;
    prepareClasses();

    const _middlewares = [
      prepareFormdataRequest,
      ...middlewares,
      finishFormdataRequest,
    ] as Middleware[];

    const _server = serve(server, async function (request: Request) {
      let response = new Response();
      let next = true;

      for (const _middleware of _middlewares) {
        try {
          const middlewareFn = getMiddlewareFunction(_middleware);
          const result = await middlewareFn({
            request,
            response,
            stop: () => (next = false),
            settings: param,
          });

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

export type {
  MethodExtraOptions,
  Middleware,
  MiddlewareObject,
} from "./src/mod.ts";
export {
  Export,
  HttpError,
  Member,
  Module,
  Param,
  Structure,
} from "./src/mod.ts";
export { STATUS_CODE };
