import type { RpcRequest } from "../../interfaces/mod.ts";
import type { ContentBody } from "@tinyrpc/sdk-core";
import type { ModuleMetadata } from "../../singletons/interfaces/mod.ts";
import { crashIfNot, getClassByName, getInstance, handleManipulators } from "../../utils/mod.ts";
import { dateDeserializer } from "@online/tinyserializers";
import { type Decoder, unpack } from "@online/packager";
import { STATUS_CODE } from "@std/http";
import { decoders } from "../../singletons/mod.ts";

const decoder: Decoder = (body: ContentBody) => {
  let result = body;

  for (const _decoder of decoders) {
    result = _decoder(result);
  }

  return result;
};

export function setRpcRequest(request: Request, body: Uint8Array) {
  const deserializedBody = unpack<ContentBody>(body, { deserializers: [dateDeserializer], decoder });
  const args = deserializedBody["&"];
  const client = deserializedBody["%"];
  const constructorArguments = deserializedBody["="];
  const [moduleName, methodName] = deserializedBody["$"].split(".");
  const moduleMetadata = getClassByName(moduleName) as ModuleMetadata | null;

  crashIfNot(moduleMetadata, "Module not found", STATUS_CODE.NotFound);

  const methodMetadata = moduleMetadata.methods.find((method) => method.name === methodName);

  crashIfNot(methodMetadata, "Method not found", STATUS_CODE.NotFound);

  const pushableArguments: unknown[] = methodMetadata.params
    // @ts-ignore: Ignore any
    .map(({ name: paramName }) => args[paramName!])
    .map(handleManipulators);

  const clazzInstance = handleManipulators(getInstance({
    moduleMetadata: moduleMetadata,
    args: constructorArguments,
    client: client as Record<string, unknown>,
  }));

  // TODO: Add an option to able a class to be created each time the method is called
  // @ts-ignore: Get class method with index name.
  const procedure: (...args: unknown[]) => unknown = clazzInstance[methodName];

  crashIfNot(procedure, "Method not found", STATUS_CODE.NotFound);

  Object.defineProperty(request, "rpc", {
    value: {
      instance: clazzInstance,
      procedure,
      arguments: args as Record<string, unknown>,
      pushableArguments,
      client,
      rawBody: body,
    } satisfies RpcRequest["rpc"],
    writable: false,
  });
}
