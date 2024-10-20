import { assert, assertInstanceOf, assertObjectMatch } from "jsr:assert";
import { runServer } from "./utils.ts";
import { Testing } from "./sdk/mod.ts";

await runServer();

Deno.test("Testing API", async (t) => {
  // @ts-ignore: It will be generated
  const testing = new Testing();

  await t.step("Method howAreYou must work and return 'OK'", async () => {
    // @ts-ignore: just ignore me
    assert(await testing.howAreYou("test") === "OK");
  });

  await t.step(
    "Method concatPlz2 must work and return 'ABCBCA'",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.concatPlz2("ABC", "BCA") === "ABCBCA");
    },
  );

  await t.step(
    'Method getObject must work and return { a: 1, b: "hola" }',
    async () => {
      // @ts-ignore: just ignore me
      const obj = await testing.getObject();
      // @ts-ignore: just ignore me
      assert(obj.a === 1);
      // @ts-ignore: just ignore me
      assert(obj.b === "hola");
      // @ts-ignore: just ignore me
      assertObjectMatch(obj, { a: 1, b: "hola" });
    },
  );

  await t.step(
    "Method addNumbers must return the sum of two numbers",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.addNumbers(2, 3) === 5);
      // @ts-ignore: just ignore me
      assert(await testing.addNumbers(-1, 1) === 0);
    },
  );

  await t.step("Method greet must return a greeting message", async () => {
    // @ts-ignore: just ignore me
    const juan = await testing.greet("Juan");
    // @ts-ignore: just ignore me
    assert(
      juan === "Hola, Juan!",
      "Message should be 'Hola, Juan!'",
    );
    // @ts-ignore: just ignore me
    assert(
      await testing.greet("Ana", "Buenos días") === "Buenos días, Ana!",
      "Message should be 'Buenos (2), Ana!'",
    );
  });

  await t.step(
    "Method multiply must return the product of two numbers",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.multiply(3, 4) === 12);
      // @ts-ignore: just ignore me
      assert(await testing.multiply(-2, 5) === -10);
    },
  );

  await t.step(
    "Method reverseString must return the reversed string",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.reverseString("hello") === "olleh");
      // @ts-ignore: just ignore me
      assert(await testing.reverseString("") === "");
    },
  );

  await t.step(
    "Method isEven must return true for even numbers",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.isEven(4) === true);
      // @ts-ignore: just ignore me
      assert(await testing.isEven(5) === false);
    },
  );

  await t.step(
    "Method getLength must return the length of the array",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.getLength([1, 2, 3]) === 3);
      // @ts-ignore: just ignore me
      assert(await testing.getLength([]) === 0);
    },
  );

  await t.step(
    "Method formatDate must return the ISO string of the date",
    async () => {
      // @ts-ignore: just ignore me
      const date = new Date("2024-01-01T00:00:00Z");
      const res = await testing.formatDate(date);
      assertInstanceOf(res, Date);
      // @ts-ignore: just ignore me
      assert(res.toISOString() === "2024-01-01T00:00:00.000Z");
    },
  );
});
