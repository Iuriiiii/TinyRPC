import type { Constructor } from "../types/mod.ts";
import type { ContentBody } from "@tinyrpc/sdk-core";
import type { MiddlewareParam } from "./interfaces/mod.ts";
import type { ModuleMetadata } from "../singletons/interfaces/mod.ts";
import type { RpcRequest } from "../interfaces/mod.ts";
import { type Decoder, unpack } from "@online/packager";
import { dateDeserializer } from "@online/tinyserializers";
import { STATUS_CODE } from "@std/http";
import { HttpError, isPostRequest } from "../mod.ts";
import { getClassByName, getClassName, getStructure } from "../utils/mod.ts";
import { crashIfNot, isRawRequest } from "../utils/mod.ts";
import { decoders, webhooks } from "../singletons/mod.ts";
import { isClassObject } from "@online/is";

const decoder: Decoder = (body: ContentBody) => {
  let result = body;

  for (const _decoder of decoders) {
    result = _decoder(result);
  }

  return result;
};

function handleManipulators(value: unknown) {
  if (!isClassObject(value)) {
    return value;
  }

  const structure = getStructure(getClassName(value as Constructor));

  if (!structure) {
    return value;
  }

  for (const member of structure.members) {
    const { manipulators = [], name: memberName } = member;
    // @ts-ignore: index access
    let result = value[memberName];

    for (const manipulator of manipulators) {
      result = manipulator(result, value);
    }

    // @ts-ignore: index access
    value[memberName] = result;
  }

  return value;
}

/**
 * Prepare request middleware, check JSON and creates "rpc" object.
 */
export async function prepareRawRequest({ request }: MiddlewareParam) {
  if (!isRawRequest(request)) {
    const url = new URL(request.url);
    const path = url.pathname;
    const webhook = webhooks.find((webhook) => webhook.url === path);

    crashIfNot(webhook, "Webhook not found.", STATUS_CODE.NotFound);

    return webhook.handler(request);
  }

  crashIfNot(isPostRequest(request), "Method not allowed");
  crashIfNot(isRawRequest(request), "Unsupported media type");

  const body = await request.bytes().catch(() => {
    throw new HttpError(STATUS_CODE.UnprocessableEntity, "Invalid request body");
  });

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

  const clazzInstance: Constructor = moduleMetadata.instance ?? new moduleMetadata.constructor(...constructorArguments);
  // TODO: Add an option to able a class to be created each time the method is called
  // @ts-ignore: Get class method with index name.
  const procedure: (...args: unknown[]) => unknown = clazzInstance[methodName];

  crashIfNot(procedure, "Method not found", STATUS_CODE.NotFound);

  Object.defineProperty(request, "rpc", {
    value: {
      clazz: clazzInstance,
      procedure,
      arguments: args as Record<string, unknown>,
      pushableArguments,
      client,
    } satisfies RpcRequest["rpc"],
    writable: false,
  });
}
