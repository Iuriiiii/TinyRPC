import type { RpcRequest, ServerSettings } from "./src/mod.ts";
import type { Middleware } from "./src/middlewares/types/mod.ts";
import { STATUS_CODE } from "@std/http";
import { getMiddlewareFunction, isHttpException, prepareRawRequest } from "./src/mod.ts";
import { finishRawRequest } from "./src/middlewares/mod.ts";
import { Serializable, SerializableClass } from "@online/packager";
import { enums, instances, modules, settings, structures } from "./src/singletons/mod.ts";
import { isUndefined } from "@online/is";
import { getMethodComments } from "./src/decorators/utils/mod.ts";

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
    const { sdk, middlewares = [], server = {}, events } = param;
    const _middlewares = [prepareRawRequest, ...middlewares, finishRawRequest] as Middleware[];

    prepareClasses();
    settings.events.onException ??= events?.onException;
    settings.events.onListen ??= events?.onListen;
    settings.events.onPrint ??= events?.onPrint;

    const onListen = (localAddr: Deno.NetAddr) => {
      settings.server = { hostname: localAddr.hostname, port: localAddr.port };
      events?.onListen?.({ host: localAddr.hostname, port: localAddr.port });
    };

    const _server = serve({ ...server, onListen, }, async (request: Request) => {
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
          events?.onException?.(error);

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
        }).catch((error) => {
          console.error(`Error compiling with ${compilerName}.`);
          console.error(error);
        });
      }
    }

    return _server;
  }
}

export { expose } from "./src/mod.ts";
export { Serializable, SerializableClass };
export { Export, Expose, HttpError, Member, Module, Param } from "./src/mod.ts";
export { STATUS_CODE };

// TODO: Implement logic to show server-warnings up to clients via sdk
// TODO: Add logs logic
// TODO: Add a new option to `TinyRPC.start` to disable logs, debugs or warnings, it must be an array
// to add more than one
// TODO!: Add `manipulators` member to members to validate members data and transform them if needed
// EJ: manipulators: [isEmail, removeArroba, endsWith(".com")]
