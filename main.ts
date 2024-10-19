import { STATUS_CODE } from "deno:http";
import {
  finishRequest,
  getMiddlewareFunction,
  instances,
  isHttpException,
  Middleware,
  modules,
  prepareRequest,
  ServerSettings,
} from "./src/mod.ts";
import { compilePackage } from "./src/tools/mod.ts";
import { Export, Module, Param } from "./src/decorators/mod.ts";
const { serve } = Deno;

function prepareClasses() {
  for (const clazz of modules) {
    instances.push({
      instance: new clazz.constructor(),
      name: clazz.moduleName ?? clazz.name,
    });
  }
}

export function TinyRPC({
  middlewares = [],
  sdk,
  options,
}: ServerSettings) {
  prepareClasses();
  const server = serve(options, async function (request: Request) {
    const allMiddlewares = [
      prepareRequest,
      ...middlewares,
      finishRequest,
    ] as Middleware[];
    let response = new Response();

    for (const middlewareStub of allMiddlewares) {
      try {
        let next = false;
        const middleware = getMiddlewareFunction(middlewareStub);
        const result = await middleware(request, response, () => (next = true));

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

        return new Response("", { status: STATUS_CODE.InternalServerError });
      }
    }

    return response;
  });

  compilePackage({
    sdk,
    host: `${server.addr.hostname}:${server.addr.port}`,
  });
}

// @Module()
// export class TestingSuper {
//   // @Export()
//   // method(
//   //   @Param() a: string,
//   //   @Param() b: number,
//   //   @Param() e: Date,
//   //   @Param() d: boolean,
//   //   // @Param() c: symbol,
//   //   // @Param() f: bigint,
//   //   // @Param() g: Set<unknown>,
//   //   // @Param() h: Float16Array,
//   // ) {
//   //   console.log({ a, b, d, e });
//   // }

//   @Export()
//   temp(
//     @Param() a: string,
//     @Param() b: number,
//     @Param({ optional: true }) e?: Date,
//     @Param({ optional: true }) d?: boolean,
//     // @Param() c: symbol,
//     // @Param() f: bigint,
//     // @Param() g: Set<unknown>,
//     // @Param() h: Float16Array,
//   ) {
//     console.log({ a, b, d, e });
//   }
// }

// TinyRPC({
//   sdk: {
//     name: "testing-super",
//   },
//   options: { port: 3000, onListen: console.log, hostname: "127.0.0.1" },
// });
