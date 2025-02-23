import { StreamableEvent } from "../enums/mod.ts";

export type StreamHandler<T extends StreamableEvent> = T extends StreamableEvent.Chunk ? (chunk: Uint8Array) => void
  : T extends StreamableEvent.Error ? (error: unknown) => void
  : T extends StreamableEvent.Close ? () => void
  : never;
