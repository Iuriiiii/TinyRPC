import { Export, Module, Param } from "../../mod.ts";

@Module()
export class Testing {
  values: string[] = [];

  @Export()
  howAreYou(@Param() _param1: string): string {
    return "OK";
  }

  @Export()
  concatPlz2(@Param() param1: string, @Param() param2: string): string {
    return param1 + param2;
  }

  @Export()
  getObject(): object {
    return { a: 1, b: "hola" };
  }

  @Export()
  addNumbers(@Param() num1: number, @Param() num2: number): number {
    return num1 + num2;
  }

  @Export()
  greet(
    @Param() name: string,
    @Param({ optional: true }) greeting: string = "Hola",
  ): string {
    return `${greeting}, ${name}!`;
  }

  @Export()
  multiply(@Param() a: number, @Param() b: number): number {
    return a * b;
  }

  @Export()
  reverseString(@Param() str: string): string {
    return str.split("").reverse().join("");
  }

  @Export()
  isEven(@Param() num: number): boolean {
    return num % 2 === 0;
  }

  @Export()
  getLength(@Param() arr: number[]): number {
    return arr.length;
  }

  @Export({ returnType: "void" })
  checkVoid(): void {
    return 1 as unknown as void;
  }

  @Export()
  formatDate(@Param() date: Date): Date {
    return date;
  }

  @Export({ returnType: "string[]" })
  getValues(): string[] {
    return this.values;
  }

  @Export({ returnType: "void" })
  addValue(@Param() value: string) {
    this.values.push(value);
  }
}
