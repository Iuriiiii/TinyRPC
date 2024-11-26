import { STATUS_CODE } from "@std/http";
import { getMiddlewareFunction, isHttpException, prepareFormdataRequest } from "./src/mod.ts";
import type { Middleware, RpcRequest, ServerSettings } from "./src/mod.ts";
import { finishFormdataRequest } from "./src/middlewares/mod.ts";
import { Serializable, SerializableClass, type SerializedClass } from "@online/packager";
import { instances, modules, structures } from "./src/singletons/mod.ts";

export type { SerializedClass };
export { Serializable, SerializableClass };

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
          },
        }).catch(() => console.error(`Error compiling with ${compilerName}.`));
      }
    }

    return _server;
  }
}

export type {
  Compiler,
  CompilerInformation,
  CompilerOptions,
  DataType,
  MemberMetadata,
  MethodExtraOptions,
  MethodMetadata,
  Middleware,
  MiddlewareObject,
  ModuleMetadata,
  ParameterMetadata,
  SdkOptions,
  ServerMetadata,
  StructureMetadata,
} from "./src/mod.ts";
export { Export, HttpError, Member, Module, Param, Structure } from "./src/mod.ts";
export { STATUS_CODE };
