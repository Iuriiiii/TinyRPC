import type { StreamHandler } from "./types/mod.ts";
import { StreamableEvent } from "./enums/mod.ts";
import { Serializable } from "@online/packager";

@Serializable()
export class Streamable {
  #events: Map<StreamableEvent, StreamHandler<StreamableEvent>[]> = new Map();

  constructor(private readonly name: string, private readonly size: number) {}

  public on<T extends StreamableEvent>(event: T, handler: StreamHandler<T>) {
    if (!this.#events.has(event)) {
      this.#events.set(event, []);
    }

    this.#events.get(event)!.push(handler);
  }
}
