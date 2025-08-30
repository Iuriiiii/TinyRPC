import type { ExposeParam } from "../decorators/interfaces/mod.ts";
import { expose } from "./expose.util.ts";
import { assert } from "@std/assert";

/**
 * Options for registering encoders, decoders, and enums.
 */
export interface RegisterParam {
  enum: object;
  enums: ExposeParam<object>[];
  as: string;
}

/**
 * Registers encoders, decoders, and enums.
 *
 * @param options - Options for registering encoders, decoders, and enums.
 */
export function register(
  { enum: _enum, enums, as: name }: Partial<RegisterParam>,
) {
  if (_enum) {
    assert(name, `"enum" member exists but "as" is not provided. Enum name is required.`);

    expose({ enum: _enum, as: name });
  } else {
    assert(!name, `"name" exists but "enum" is not provided. Enum object is required.`);
  }

  enums?.forEach(expose);
}
