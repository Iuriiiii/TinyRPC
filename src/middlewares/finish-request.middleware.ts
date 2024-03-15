import {
  NextMiddleware,
  RpcRequest
} from "../mod.ts";

export async function finishRequest(
  request: RpcRequest,
  response: Response,
  next: NextMiddleware
) {
  const { procedure, arguments: args } = request.rpc;
  const result = await procedure(...args);
  next();
  return Response.json(result ?? {}, { status: 200 });
}
