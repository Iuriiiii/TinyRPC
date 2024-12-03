import type { ClassDecorator, Constructor } from "../types/mod.ts";
import type { ExposeDecoratorOptions } from "../interfaces/mod.ts";
import { members, structures } from "../singletons/mod.ts";
import { Serializable } from "@online/packager";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";

export function Expose(options?: ExposeDecoratorOptions): ClassDecorator {
  return function (target: Constructor) {
    assert(
      !isUndefined(target),
      `
The "Expose" decorator can't read the class information.
Did you enable decorators on your project?
    `.trim(),
    );

    const isInterface = !!options?.as;
    const className = target.name;

    if (isInterface) {
      // TODO: Enhance this to parse classes statically.
      // const someMemberIsAMethod = members.some((member) => member instanceof Function);

      // assert(
      //   !someMemberIsAMethod,
      //   `Interfaces can't have methods, error in "${className}".`,
      // );
    }

    Serializable()(target);
    structures.push({
      constructor: target,
      name: className,
      members: [...members],
      isInterface,
    });
    members.length = 0;
  };
}
