import { TinyRPC } from "../mod.ts";
import "./modules/testing.module.ts";

TinyRPC.start({
  sdk: {
    path: "./tests/sdk",
    // doNotGenerate: true
  },
  options: {
    hostname: "127.0.0.1",
    onListen: (attr) => console.log(`Listening on port ${attr.port}`),
  },
});
