import { Reflect } from "jsr:reflection";
import { assert } from "jsr:assert";
import type { Constructor } from "../types/mod.ts";
import type {
  MemberDecoratorOptions,
  MemberMetadata,
} from "../interfaces/mod.ts";
import { members } from "../singletons/mod.ts";

// TODO: Add a member to force update the client-side member when the server-side member is updated
// deno-lint-ignore no-explicit-any
export function Member(options?: MemberDecoratorOptions): any {
  console.log("src/decorators/member.decorator.ts:13->Member");
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
    console.log("src/decorators/member.decorator.ts:13->$Member");
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
        autoSync: options?.autoSync ?? false,
      } satisfies MemberMetadata,
    );
  };
}
