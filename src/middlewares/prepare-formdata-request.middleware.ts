import { STATUS_CODE } from "jsr:http";
import { HttpError, isPostRequest } from "../mod.ts";
import { getClassByName } from "../utils/mod.ts";
import type {
  FormdataRpcRequest,
  MiddlewareParam,
  ModuleMetadata,
} from "../interfaces/mod.ts";
import type { Constructor } from "../types/mod.ts";
import { type Database, deserialize } from "@online/tinyserializer";
import { uInt8ArrayDeserializer } from "@online/tinyserializers";
import type { ContentBody, ResponseBody } from "@online/tinyrpc-sdk-core";

/**
 * Prepare request middleware, check JSON and creates "rpc" object.
 */
export async function prepareFormdataRequest(
  { request }: MiddlewareParam,
) {
  if (!isPostRequest(request)) {
    throw new HttpError(STATUS_CODE.MethodNotAllowed, "Method not allowed");
  }

  const contentType = request.headers.get("content-type");
  const isNotApplicationRaw = typeof contentType !== "string" ||
    !contentType.startsWith("application/raw");

  if (isNotApplicationRaw) {
    throw new HttpError(
      STATUS_CODE.UnsupportedMediaType,
      "Unsupported media type",
    );
  }

  const body = await (async () => {
    try {
      return await request.bytes();
    } catch {
      throw new HttpError(
        STATUS_CODE.UnprocessableEntity,
        "Invalid request body",
      );
    }
  })();

  const { value: deserializedBody } = deserialize<ResponseBody>(body, {
    deserializers: [uInt8ArrayDeserializer],
  });
  const { value: deserializedObjectDatabase } = deserialize<Database<object>>(
    deserializedBody.O,
    { deserializers: [uInt8ArrayDeserializer] },
  );
  const { value: deserializedStringDatabase } = deserialize<Database<string>>(
    deserializedBody.S,
    { deserializers: [uInt8ArrayDeserializer] },
  );
  const { value: deserializedContentBody } = deserialize<ContentBody>(
    deserializedBody.X,
    {
      deserializers: [uInt8ArrayDeserializer],
      objectDatabase: deserializedObjectDatabase,
      stringDatabase: deserializedStringDatabase,
    },
  );
  const args = deserializedContentBody["&"];
  const client = deserializedContentBody["%"];
  const [moduleName, methodName] = deserializedContentBody["$"].split(".");
  const moduleMetadata = getClassByName(moduleName) as ModuleMetadata | null;

  if (moduleMetadata === null) {
    throw new HttpError(STATUS_CODE.BadRequest, "Module not found");
  }

  const methodMetadata = moduleMetadata.methods.find((method) =>
    method.name === methodName
  );

  if (!methodMetadata) {
    throw new HttpError(STATUS_CODE.BadRequest, "Method not found");
  }

  const pushableArguments: unknown[] = methodMetadata.params
    // @ts-ignore: Ignore any
    .map(({ name: paramName }) => args[paramName!])
    .reverse();
  const clazzInstance = moduleMetadata.instance as Constructor;

  // TODO: Add an option to able a class to be created each time the method is called
  // @ts-ignore: Get class method with index name.
  const procedure: (...args: unknown[]) => unknown = clazzInstance[methodName];

  if (!procedure) {
    throw new HttpError(STATUS_CODE.BadRequest, "Method not found");
  }

  Object.defineProperty(request, "rpc", {
    value: {
      clazz: clazzInstance,
      procedure,
      arguments: args as Record<string, unknown>,
      pushableArguments,
      client,
    } satisfies FormdataRpcRequest["rpc"],
    writable: false,
  });
}
