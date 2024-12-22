// deno-lint-ignore no-explicit-any
export type MethodDecorator = (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
