import { Export, Module, Param } from "../../core.ts";
import { TinyRPC } from "../../main.ts";

@Module()
export class Testing {
  @Export()
  method(@Param() param1: string) {
    console.log(param1);
  }
}

TinyRPC({
  options: {
    onListen: console.log,
  },
});
