import type { ClassReference } from "../../types/mod.ts";

export interface TypedClass<T> extends ClassReference<T> {
  new (): T;
}
