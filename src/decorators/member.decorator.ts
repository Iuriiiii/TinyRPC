import type { MemberDecoratorOptions, MemberMetadata } from "../interfaces/mod.ts";
import type { Constructor, MemberDecorator } from "../types/mod.ts";
import { Reflect } from "@dx/reflect";
import { assert } from "@std/assert";
import { members } from "../singletons/mod.ts";
import { isUndefined } from "@online/is";

/**
 * Declare a member.
 *
 * @param {MemberDecoratorOptions} options
 * @returns {MemberDecorator}
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

    const dataType = options?.dataType ?? Reflect.getMetadata(
      "design:type",
      target,
      propertyKey,
    ) as Constructor | undefined;

    assert(
      !isUndefined(dataType),
      `The "Member" decorator is for methods only.`,
    );

    members.push(
      {
        dataType,
        name: options?.name ?? propertyKey,
        optional: options?.optional ?? false,
        defaultValue: options?.defaultValue,
        nullable: options?.nullable,
        private: options?.private ?? false,
        readonly: options?.readonly ?? false,
        autoSync: options?.autoSync ?? false,
        constructorParam: options?.constructorParam,
      } satisfies MemberMetadata,
    );
  };
}
