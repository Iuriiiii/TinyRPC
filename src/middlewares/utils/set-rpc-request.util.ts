import type { RpcRequest } from "../../interfaces/mod.ts";
import type { ContentBody } from "@tinyrpc/sdk-core";
import type { ModuleMetadata } from "../../singletons/interfaces/mod.ts";
import { crashIfNot, getClassByName, getModuleInstance, handleManipulators } from "../../utils/mod.ts";
import { dateDeserializer } from "@online/tinyserializers";
import { type Decoder, unpack } from "@online/packager";
import { STATUS_CODE } from "@std/http";
import { decoders } from "../../singletons/mod.ts";
import { getModuleAndMethod } from "./get-module-and-method.util.ts";
import { isRawStreamRequest } from "../validators/mod.ts";
import { getModuleArguments } from "./get-module-arguments.util.ts";
import { HttpError } from "../../exceptions/mod.ts";

const decoder: Decoder = (body: ContentBody) => {
  let result = body;

  for (const _decoder of decoders) {
    result = _decoder(result);
  }

  return result;
};

export async function setRpcRequest(request: Request) {
  const { moduleName, methodName } = getModuleAndMethod(request);
  const moduleMetadata = getClassByName(moduleName) as ModuleMetadata | null;

  crashIfNot(moduleMetadata, `Module ${moduleName} not found`, STATUS_CODE.NotFound);

  const constructorArguments = getModuleArguments(request, moduleMetadata);
  // const constructorBody = getModuleMembers(request);
  const clazzInstance = handleManipulators(
    getModuleInstance({
      moduleMetadata,
      args: constructorArguments,
      client: {} as Record<string, unknown>,
    }),
  );

  const methodMetadata = moduleMetadata.methods.find((method) => method.name === methodName);

  crashIfNot(methodMetadata, `Method ${methodName} not found`, STATUS_CODE.NotFound);

  // TODO: Add an option to able a class to be created each time the method is called
  // @ts-ignore: Get class method with index name.
  const procedure: (...args: unknown[]) => unknown = clazzInstance[methodName];

  crashIfNot(procedure, `Method ${methodName} not found`, STATUS_CODE.NotFound);

  const pushableArguments: unknown[] = await (async () => {
    if (isRawStreamRequest(request)) {
      return [request.body!];
    }

    const body = await request.bytes().catch(() => {
      throw new HttpError(STATUS_CODE.UnprocessableEntity, "Invalid request body");
    });

    const deserializedBody = unpack<ContentBody>(body, { deserializers: [dateDeserializer], decoder });
    const args = deserializedBody["&"];
    // const client = deserializedBody["%"];

    return methodMetadata.params
      // @ts-ignore: Ignore any
      .map(({ name: paramName }) => args[paramName!])
      .map(handleManipulators);
  })();

  Object.defineProperty(request, "rpc", {
    value: {
      instance: clazzInstance,
      procedure,
      // arguments: args as Record<string, unknown>,
      pushableArguments,
      // client,
      // rawBody: body,
    } satisfies RpcRequest["rpc"],
    writable: false,
  });
}
