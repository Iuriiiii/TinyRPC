// deno-lint-ignore no-explicit-any ban-types

// import { Constructor } from "../types/mod.ts";

// interface ModuleMetadata {}

// const map = new Map();

// function Module(moduleName?: string) {
//   return function <T extends Constructor>(
//     constructor: T,
//     _context: ClassDecoratorContext
//   ) {
//     const className = moduleName || constructor.name;

//     if (map.has(className)) {
//       throw new Error(`Module "${className}" its duplicated.`);
//     }

//     map.set(className, constructor);
//     return class extends constructor {};
//   };
// }

// function Invokable(methodName: string) {
//   return function (method: Function, context: ClassMethodDecoratorContext) {};
// }

// function logMethod(
//   target: Function,
//   propertyKey: string,
//   descriptor: PropertyDescriptor
// ) {
//   const originalMethod = descriptor.value;

//   descriptor.value = function (...args: any[]) {
//     console.log(
//       `Calling method: ${propertyKey} with arguments: ${JSON.stringify(args)}`
//     );
//     const result = originalMethod.apply(this, args);
//     console.log(`Method ${propertyKey} returned: ${JSON.stringify(result)}`);
//     return result;
//   };
// }

// function epicLog(value: string) {
//   console.log("DEBUG ON mod.ts:46", value);
//   return logMethod;
// }

// // function trace(fn: any, ctx: ClassMethodDecoratorContext) {
// //   return function (...args: unknown[]) {
// //     console.log("ENTERED", ctx.name);
// //     const v = fn(...args);
// //     console.log("EXITED", ctx.name);
// //     return v;
// //   };
// // }

// @Module("qwdqwd")
// export class Test {
//   @Invokable()
//   @epicLog("asdasd")
//   public test(a: number, b: string) {
//     console.log(`Arguments are: ${a}, ${b}`);
//   }
// }

export * from "./serializable.decorator.ts";
export * from "./export.decorator.ts";
export * from "./param.decorator.ts";
export * from "./request.decorator.ts";
export * from "./module.decorator.ts";
export * from "./response.decorator.ts";
