import type { Constructor } from "./constructor.type.ts";

export type ClassDecorator = (target: Constructor) => void;
