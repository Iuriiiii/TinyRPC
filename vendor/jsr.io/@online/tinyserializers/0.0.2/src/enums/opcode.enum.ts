import { Opcode as TinySerializerOpcode } from "jsr:/@online/tinyserializer@^0.0.9/types";

export enum Opcode {
    Uint8Array = TinySerializerOpcode.Latest + 1,
}
