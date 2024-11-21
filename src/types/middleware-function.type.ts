import type { MiddlewareParam } from "../interfaces/mod.ts";
import type { TypeAndPromise } from "./type-and-promise.type.ts";

export type MiddlewareFunction = (
  param: MiddlewareParam,
) => TypeAndPromise<Response | void>;
