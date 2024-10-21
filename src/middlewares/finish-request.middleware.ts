import { serializeValue } from "@online/bigserializer";
import type { NextMiddleware, RpcRequest } from "../mod.ts";

export async function finishRequest(
  request: RpcRequest,
  _response: Response,
  next: NextMiddleware,
) {
  const { procedure, arguments: args, clazz } = request.rpc;
  const result = (await procedure.apply(clazz, args)) ?? {};
  next();

  return Response.json(serializeValue(result), { status: 200 });
}
