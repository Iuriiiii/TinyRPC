import { STATUS_CODE } from "deno:http";
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

function prepareClasses() {
  for (const clazz of modules) {
    instances.push({
      instance: new clazz.constructor(),
      name: clazz.moduleName ?? clazz.name,
    });
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

    const server = serve(server, async function (request: Request) {
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
          // TODO: Improve this!
          if (isHttpException(error)) {
            return new Response(error.message, { status: error.errorCode });
          }

          return new Response(null, {
            status: STATUS_CODE.InternalServerError,
          });
        }
      }

      return response;
    });

    if (!sdk?.doNotGenerate) {
      compilePackage({
        sdk,
        host: `${server.addr.hostname}:${server.addr.port}`,
      });
    }
  }
}

export * from "./src/mod.ts";
