import type { Middleware, RpcRequest, ServerSettings } from "./src/mod.ts";
import { STATUS_CODE } from "@std/http";
import { getMiddlewareFunction, isHttpException, prepareFormdataRequest } from "./src/mod.ts";
import { finishFormdataRequest } from "./src/middlewares/mod.ts";
import { Serializable, SerializableClass } from "@online/packager";
import { enums, instances, modules, structures } from "./src/singletons/mod.ts";
import { isUndefined } from "@online/is";

const { serve } = Deno;

/**
 * Create instances of all classes to be used
 * on requests, just if those classes has no constructor
 * arguments
 */
function prepareClasses() {
  for (const module of modules) {
    const isSomeMemberAConstructorArgument = module.members.some((member) => !isUndefined(member.constructorParam));

    if (!isSomeMemberAConstructorArgument) {
      module.instance = new module.constructor();
    }

    instances.set(module.name, module);
    instances.set(module, module.name);
  }
}

/**
 * TinyRPC main class.
 */
export class TinyRPC {
  /**
   * Starts an HTTP(s) server to start processing RPC requests
   */
  static start(param: Partial<ServerSettings> = {}): Deno.HttpServer<Deno.NetAddr> {
    const { sdk, middlewares = [], server = {} } = param;
    const _middlewares = [prepareFormdataRequest, ...middlewares, finishFormdataRequest] as Middleware[];

    prepareClasses();

    const _server = serve(server, async function (request: Request) {
      let response = new Response();
      let next = true;

      for (const _middleware of _middlewares) {
        try {
          const middlewareFn = getMiddlewareFunction(_middleware);
          const result = await middlewareFn({
            request: request as RpcRequest<object>,
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
          return new Response(error.message ?? error.description ?? null, { status: STATUS_CODE.InternalServerError });
        }
      }

      return response;
    });

    if (!sdk?.doNotGenerate) {
      const compilers = sdk?.compilers ?? [];

      for (const { name: compilerName, compiler } of compilers) {
        compiler({
          server,
          sdkOptions: sdk,
          metadata: {
            instances,
            modules,
            structures,
            enums,
          },
        }).catch(() => console.error(`Error compiling with ${compilerName}.`));
      }
    }

    return _server;
  }
}

export { expose } from "./src/mod.ts";
export { Serializable, SerializableClass };
export { Export, Expose, HttpError, Member, Module, Param } from "./src/mod.ts";
export { STATUS_CODE };
