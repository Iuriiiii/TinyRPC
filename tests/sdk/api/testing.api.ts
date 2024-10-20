import { rpc } from "../utils/mod.ts";

export class Testing {
  howAreYou(param0: string): Promise<string> {
    return rpc<string>("Testing", "howAreYou", [param0]);
  }

  concatPlz2(param0: string, param1: string): Promise<string> {
    return rpc<string>("Testing", "concatPlz2", [param0, param1]);
  }

  getObject(): Promise<any> {
    return rpc<any>("Testing", "getObject", []);
  }

  addNumbers(param0: number, param1: number): Promise<number> {
    return rpc<number>("Testing", "addNumbers", [param0, param1]);
  }

  greet(param0: string, param1?: string): Promise<string> {
    return rpc<string>("Testing", "greet", [param0, param1]);
  }

  multiply(param0: number, param1: number): Promise<number> {
    return rpc<number>("Testing", "multiply", [param0, param1]);
  }

  reverseString(param0: string): Promise<string> {
    return rpc<string>("Testing", "reverseString", [param0]);
  }

  isEven(param0: number): Promise<boolean> {
    return rpc<boolean>("Testing", "isEven", [param0]);
  }

  getLength(param0: Array<any>): Promise<number> {
    return rpc<number>("Testing", "getLength", [param0]);
  }

  formatDate(param0: Date): Promise<Date> {
    return rpc<Date>("Testing", "formatDate", [param0]);
  }
}
