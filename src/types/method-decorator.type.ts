import type { Constructor } from "./constructor.type.ts";

export type MethodDecorator = (target: Constructor, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
