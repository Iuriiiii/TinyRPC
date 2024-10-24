import { assert, assertInstanceOf, assertObjectMatch } from "jsr:assert";
import { runServer } from "./utils.ts";
import { Testing, User } from "./sdk/mod.ts";
import { Location } from "./sdk/structures/location.structure.ts";

await runServer();

Deno.test("Testing API", async (t) => {
  // @ts-ignore: It will be generated
  const testing = new Testing();

  await t.step("Method howAreYou must work and return 'OK'", async () => {
    // @ts-ignore: just ignore me
    assert(await testing.howAreYou({ param0: "test" }) === "OK");
  });

  await t.step(
    "Method concatPlz2 must work and return 'ABCBCA'",
    async () => {
      // @ts-ignore: just ignore me
      assert(
        await testing.concatPlz2({ param0: "ABC", param1: "BCA" }) === "ABCBCA",
      );
    },
  );

  await t.step(
    'Method getObject must work and return { a: 1, b: "hola" }',
    async () => {
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
      assert(await testing.addNumbers({ param0: 2, param1: 3 }) === 5);
      assert(await testing.addNumbers({ param0: -1, param1: 1 }) === 0);
    },
  );

  await t.step("Method greet must return a greeting message", async () => {
    // @ts-ignore: just ignore me
    const juan = await testing.greet({ param0: "Juan" });
    // @ts-ignore: just ignore me
    assert(
      juan === "Hola, Juan!",
      "Message should be 'Hola, Juan!'",
    );
    // @ts-ignore: just ignore me
    assert(
      await testing.greet({ param0: "Ana", param1: "Buenos días" }) ===
        "Buenos días, Ana!",
      "Message should be 'Buenos (2), Ana!'",
    );
  });

  await t.step(
    "Method multiply must return the product of two numbers",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.multiply({ param0: 3, param1: 4 }) === 12);
      // @ts-ignore: just ignore me
      assert(await testing.multiply({ param0: -2, param1: 5 }) === -10);
    },
  );

  await t.step(
    "Method reverseString must return the reversed string",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.reverseString({ param0: "hello" }) === "olleh");
      // @ts-ignore: just ignore me
      assert(await testing.reverseString({ param0: "" }) === "");
    },
  );

  await t.step(
    "Method isEven must return true for even numbers",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.isEven({ param0: 4 }) === true);
      // @ts-ignore: just ignore me
      assert(await testing.isEven({ param0: 5 }) === false);
    },
  );

  await t.step(
    "Method getLength must return the length of the array",
    async () => {
      // @ts-ignore: just ignore me
      assert(await testing.getLength({ param0: [1, 2, 3] }) === 3);
      // @ts-ignore: just ignore me
      assert(await testing.getLength({ param0: [] }) === 0);
    },
  );

  await t.step(
    "Method formatDate must return the ISO string of the date",
    async () => {
      // @ts-ignore: just ignore me
      const date = new Date("2024-01-01T00:00:00Z");
      const res = await testing.formatDate({ param0: date });
      assertInstanceOf(res, Date);
      // @ts-ignore: just ignore me
      assert(res.toISOString() === "2024-01-01T00:00:00.000Z");
    },
  );

  await t.step(
    "Method checkVoid must return undefined",
    async () => {
      // @ts-ignore: just ignore me
      const res = await testing.checkVoid();
      // @ts-ignore: just ignore me
      // FIXME: this is a bad result, res must be void or undefined
      assert(res === undefined);
    },
  );

  await t.step(
    "Method getValues must return an empty array of strings",
    async () => {
      // @ts-ignore: just ignore me
      const res = await testing.getValues();
      assertInstanceOf(res, Array);
      // @ts-ignore: just ignore me
      assert(res.length === 0);
    },
  );

  await t.step(
    "Method addValue must push the value to the array of strings",
    async () => {
      // @ts-ignore: just ignore me
      const res = await testing.addValue({ param0: "Hola Mundo" });
      // @ts-ignore: just ignore me
      assert(res === undefined);
    },
  );

  await t.step(
    "Method getValues must return an array of strings with the previous value pushed",
    async () => {
      // @ts-ignore: just ignore me
      const res = await testing.getValues();
      assertInstanceOf(res, Array);
      // @ts-ignore: just ignore me
      assert(res.length === 1);
      assert(res[0]! === "Hola Mundo");
    },
  );

  await t.step(
    "Method addUser must return an user",
    async () => {
      const usr = new User();
      usr.name = "Juan";
      usr.age = 30;
      usr.location = new Location();
      usr.location.country = "Colombia";
      const res = await testing.addUser({ param0: usr });
      assertInstanceOf(res, User);
      assert(res.name === usr.name);
      assert(res.age === usr.age);
      assertInstanceOf(res.location, Location);
      assert(res.location.country === usr.location.country);
    },
  );

  await t.step(
    "Method checkRequest must return true if its first argument is the request object",
    async () => {
      // @ts-ignore: just ignore me
      const res = await testing.checkRequest();
      assert(res === true);
    },
  );

  await t.step(
    "Method checkRequest2 must return true if its first argument is true and the latest one is a Request instance",
    async () => {
      // @ts-ignore: just ignore me
      const res = await testing.checkRequest2({ param0: true });
      assert(res === true);
    },
  );

  await t.step(
    "Method checkRequest2 must return false if its first argument is false and the latest one is a Request instance",
    async () => {
      // @ts-ignore: just ignore me
      const res = await testing.checkRequest2({ param0: false });
      assert(res === false);
    },
  );
});
