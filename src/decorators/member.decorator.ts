import { Reflect } from "jsr:reflection";
import { assert } from "jsr:assert";
import type { Constructor } from "../types/mod.ts";
import type {
  MemberDecoratorOptions,
  MemberMetadata,
} from "../interfaces/mod.ts";
import { members } from "../singletons/mod.ts";

// deno-lint-ignore no-explicit-any
export function Member(options?: MemberDecoratorOptions): any {
  return function (
    /**
     * The class decored.
     */
    target: unknown,
    /**
     * The current method.
     */
    propertyKey: string | symbol,
    /**
     * The param index.
     */
    _index: number,
  ) {
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
      dataType !== undefined,
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
      } satisfies MemberMetadata,
    );
  };
}
