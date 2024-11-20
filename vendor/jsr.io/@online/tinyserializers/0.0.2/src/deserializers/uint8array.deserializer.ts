import type { DeserializeOptions } from "jsr:/@online/tinyserializer@^0.0.9/types";
import { Opcode } from "../enums/mod.ts";
import { unumberDeserializer } from "jsr:@online/tinyserializer@^0.0.9";

export function uInt8ArrayDeserializer(
  serialized: Uint8Array,
  options: DeserializeOptions,
): Uint8Array | null {
  const currentOpcode = serialized.at(options.offset)!;

  if (currentOpcode !== Opcode.Uint8Array) {
    return null;
  }

  options.offset++;

  const length = unumberDeserializer(serialized, options);
  const value = serialized.subarray(options.offset, options.offset + length!);
  options.offset += length!;

  return value;
}
