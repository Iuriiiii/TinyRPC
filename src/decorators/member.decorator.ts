import type { Constructor } from "../types/mod.ts";
import type { MemberDecoratorOptions } from "./interfaces/mod.ts";
import type { MemberDecorator } from "./types/mod.ts";
import type { MemberMetadata } from "../singletons/interfaces/mod.ts";
import { Reflect } from "@dx/reflect";
import { assert } from "@std/assert";
import { members } from "../singletons/mod.ts";
import { isUndefined } from "@online/is";

/**
 * Declare a member.
 *
 * @param options
 */
export function Member(options?: MemberDecoratorOptions): MemberDecorator {
  return function (
    // deno-lint-ignore no-explicit-any
    target: any,
    propertyKey: string | symbol,
  ) {
    assert(
      !isUndefined(target),
      `
The "Member" decorator can't read the class information.
Did you enable decorators on your project?
    `.trim(),
    );
    assert(
      typeof propertyKey !== "symbol",
      `The "Member" decorator does not works with symbols.`,
    );

    const className = target.constructor.name;
    const dataType = options?.dataType ?? Reflect.getMetadata(
      "design:type",
      target,
      propertyKey,
    ) as Constructor | undefined;

    assert(
      !isUndefined(dataType),
      `The "Member" decorator needs a typed class member. Parameter "${className}.${propertyKey}" is not explicitly typed.`,
    );

    if (options?.identifier) {
      // @ts-ignore: compare `dataType` with `String` and `Number`
      assert([String, Number].includes(dataType), "Identifier must be a string or number.");
    }

    members.push(
      {
        dataType,
        name: options?.name ?? propertyKey,
        defaultValue: options?.defaultValue,
        optional: options?.optional ?? false,
        nullable: options?.nullable ?? false,
        private: options?.private ?? false,
        readonly: options?.readonly ?? false,
        autoSync: options?.autoSync ?? false,
        constructorParam: options?.constructorParam,
        identifier: options?.identifier ?? false,
        manipulators: options?.manipulators ?? [],
      } satisfies MemberMetadata,
    );
  };
}
