import { Export, Member, type MethodExtraOptions, Module, Param, SerializableClass, type SerializedClass, Structure } from "../../mod.ts";

@Structure()
class Location extends SerializableClass {
  @Member({ optional: true })
  country!: string;

  public override serialize(): SerializedClass<typeof Location> {
    return {
      arguments: [],
      members: {
        country: this.country,
      },
    };
  }
}

@Structure()
class User extends SerializableClass {
  @Member({ optional: true })
  id!: number;

  @Member()
  name!: string;

  @Member()
  age!: number;

  @Member()
  location!: Location;

  public override serialize(): SerializedClass<typeof User> {
    return {
      arguments: [],
      members: {
        id: this.id,
        name: this.name,
        age: this.age,
        location: this.location,
      },
    };
  }
}

@Module()
export class Testing {
  values: string[] = [];
  userId: number = 0;
  users: User[] = [];

  @Member({ private: true, autoSync: true })
  clientValue!: number;

  @Export()
  howAreYou(@Param() _param1: string): string {
    return "OK";
  }

  @Export<Testing>({ returnType: "void", links: ["clientValue"] })
  updateClientValue(@Param() value: number) {
    this.clientValue = value;
  }

  @Export<Testing>({ links: ["clientValue"] })
  getClientValue(): number {
    return this.clientValue;
  }

  @Export()
  concatPlz2(@Param() param1: string, @Param() param2: string): string {
    return param1 + param2;
  }

  @Export({ returnType: [Number] })
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

  @Export()
  addUser(@Param() user: User): User {
    user.id = this.userId++;
    this.users.push(user);

    return user;
  }

  @Export()
  checkRequest({ request }: MethodExtraOptions<Testing>): boolean {
    return request instanceof Request;
  }

  @Export()
  checkRequest2(
    @Param() argument: boolean,
    { request }: MethodExtraOptions<Testing>,
  ): boolean {
    return argument && request instanceof Request;
  }
}
