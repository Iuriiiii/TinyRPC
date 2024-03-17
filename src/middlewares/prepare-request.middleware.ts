import { STATUS_CODE } from "deno:http";
import {
  deserializeValue,
  getClassByName,
  HttpError,
  isPostRequest,
  isRpcRequest,
  MethodNotAllowedException,
  NextMiddleware,
  NotFoundException,
  RpcRequest,
} from "../mod.ts";

export async function prepareRequest(
  request: RpcRequest,
  response: Response,
  next: NextMiddleware,
) {
  if (!isPostRequest(request)) {
    throw new MethodNotAllowedException();
  }

  const isJsonContentType = request.headers.has("content-type") &&
    request.headers.get("content-type") === "application/json";

  if (!isJsonContentType) {
    throw new HttpError(STATUS_CODE.UnsupportedMediaType);
  }

  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    throw new HttpError(STATUS_CODE.UnprocessableEntity);
  }

  if (!isRpcRequest(body)) {
    throw new HttpError(STATUS_CODE.UnprocessableEntity);
  }

  const { m: moduleName, fn: methodName, args } = body;
  const clazz = getClassByName(moduleName);

  if (clazz === null) {
    throw new NotFoundException();
  }

  // @ts-ignore: Get class method.
  const procedure: (...args: unknown[]) => unknown = clazz[methodName];
  const compiledArguments: unknown[] = [];

  for (const argument of args) {
    const value: unknown = deserializeValue(argument);

    compiledArguments.push(value);
  }

  Object.defineProperty(request, "rpc", {
    value: {
      procedure,
      arguments: compiledArguments,
      body,
    },
    writable: false,
  });

  return next();
}
