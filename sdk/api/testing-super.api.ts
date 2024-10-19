import { rpc } from "../utils/mod.ts";

export class TestingSuper {
    temp(param0: string, param1: number, param2?: Date, param3?: boolean) {
        return rpc("TestingSuper", "temp", [param0, param1, param2, param3]);
    }
}