import type { TypeAndPromise } from "../../types/mod.ts";
import type { MiddlewareParam } from "../interfaces/mod.ts";

export type MiddlewareFunction = (param: MiddlewareParam) => TypeAndPromise<Response | void>;
