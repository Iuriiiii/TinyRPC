import type { RpcRequest, ServerSettings } from "./src/mod.ts";
import type { Middleware } from "./src/middlewares/types/mod.ts";
import type { IHandlerOptions, IServer } from "@online/serve";
import { STATUS_CODE } from "@std/http";
import { getMiddlewareFunction, isHttpException, prepareRawRequest } from "./src/mod.ts";
import { finishRawRequest } from "./src/middlewares/mod.ts";
import { Serializable, SerializableClass } from "@online/packager";
import { enums, instances, modules, settings, structures } from "./src/singletons/mod.ts";
import { isUndefined } from "@online/is";
import { serve } from "@online/serve";

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
  static start(param: Partial<ServerSettings> = {}): Promise<IServer> {
    const { sdk, middlewares = [], server = {}, events, websockHandler } = param;
    const _middlewares = [prepareRawRequest, ...middlewares, finishRawRequest] as Middleware[];

    prepareClasses();
    settings.events.onException ??= events?.onException;
    settings.events.onListen ??= events?.onListen;
    settings.events.onPrint ??= events?.onPrint;

    const requestHandler = async ({ request, upgradeToWebSocket }: IHandlerOptions) => {
      let response = new Response();
      let next = true;

      for (const _middleware of _middlewares) {
        try {
          const middlewareFn = getMiddlewareFunction(_middleware);
          const result = await middlewareFn({
            request: request as RpcRequest<object>,
            response,
            stop: () => (next = false),
            upgradeToWebSocket,
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
    };

    const _server = serve({
      ...server,
      wsHandler: websockHandler,
      handler: requestHandler,
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

export { Serializable, SerializableClass };
export { DatatypeType, Export, Expose, expose, HttpError, Member, Module, Param } from "./src/mod.ts";
export { STATUS_CODE };

// TODO: Implement logic to show server-warnings up to clients via sdk
// TODO: Add a new option to `TinyRPC.start` to disable logs, debugs or warnings, it must be an array
// to add more than one
