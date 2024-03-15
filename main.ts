import { STATUS_CODE } from "https://deno.land/std@0.219.0/http/status.ts";
import {
  Export,
  finishRequest,
  getMiddlewareFunction,
  instances,
  Interface,
  isHttpException,
  Middleware,
  Module,
  modules,
  Param,
  prepareRequest,
  Serializable,
  ServerSettings,
} from "./src/mod.ts";

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
  options,
  packagePath = Deno.cwd() + "\\package",
}: ServerSettings) {
  prepareClasses();
  return Deno.serve(options, async function (request: Request) {
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
}

export * from "./src/mod.ts";

interface TemporalInterface {
  a: number;
}

@Module()
class Temp {
  @Export()
  method(@Param() @Interface("TemporalInterface") param: number) {
  }
}

console.log("DEBUG ON main.ts:82", modules[0].methods[0].parameters);

// import { parse } from "node:ts-estree";

// const path = Deno.cwd() + "\\tests\\modules\\testing.module.ts";
// const fileContent = new TextDecoder().decode(Deno.readFileSync(path));
// const ast = parse(fileContent, { tokens: true });

// console.log(ast);

// class a {}

// @Serializable()
// class UsersParameter {
//   message: string = "";
// }

// @Module()
// class Users {
//   @Export()
//   message(@Param() arg: UsersParameter, @Param() adios: a): string {
//     return "hola";
//   }
// }

// TinyRPC({
//   options: { port: 4000 },
// });

// import { gunzip, gzip } from "deno:zlib";
// import { Buffer } from "deno:io";
// import { encodeBase64 } from "deno:base64";

// const argument = {
//   a: "hola cómo estás",
//   b: 222,
//   c: 3.3,
//   d: { a: "Necesito azucar", b: { a: "Yo necesito café" } },
// };

// const serializedValue = serializeValue(argument);
// const jsonSerialized = JSON.stringify(serializedValue);
// const encoder = new TextEncoder();
// const buffer = encoder.encode(jsonSerialized);
// const zip = gzip(buffer, { level: 9 });
// const zipBase64 = encodeBase64(zip);
// const unzip = gunzip(zip);

// console.log("DEBUG ON main.ts:104", jsonSerialized.length);

// const information = {
//   jsonSize: jsonSerialized.length,
//   bufferSize: buffer.byteLength,
//   zipSize: zip.byteLength,
//   zipBase64Size: zipBase64.length,
//   unzipSize: unzip.length,
// };

// console.log(information);

// console.log(serializedValue);
