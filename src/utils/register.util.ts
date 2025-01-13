import type { Decoder, Encoder } from "@online/packager";
import type { ExposeParam } from "../decorators/interfaces/mod.ts";
import { decoders, encoders } from "../singletons/mod.ts";
import { expose } from "./expose.util.ts";
import { assert } from "@std/assert";

export interface RegisterParam {
  encoder: Encoder;
  encoders: Encoder[];
  decoder: Decoder;
  decoders: Decoder[];
  enum: object;
  enums: ExposeParam<object>[];
  as: string;
}

export function register(
  { encoder, encoders: _encoders, decoder, decoders: _decoders, enum: _enum, enums, as: name }: Partial<RegisterParam>,
) {
  if (encoder) {
    encoders.push(encoder);
  }

  if (decoder) {
    decoders.push(decoder);
  }

  _encoders?.forEach((encoder) => encoders.push(encoder));
  _decoders?.forEach((decoder) => decoders.push(decoder));

  if (_enum) {
    assert(name, `"enum" member exists but "as" is not provided. Enum name is required.`);

    expose({ enum: _enum, as: name });
  } else {
    assert(!name, `"name" exists but "enum" is not provided. Enum object is required.`);
  }

  enums?.forEach(expose);
}
