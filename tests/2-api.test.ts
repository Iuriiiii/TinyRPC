import { assert, assertInstanceOf, assertObjectMatch } from "@std/assert";
import { runServer } from "./utils.ts";
import { Testing, User } from "./sdk/mod.ts";
import { Location } from "./sdk/structures/location.structure.ts";

await runServer();

Deno.test("Testing API", async (t) => {
  // @ts-ignore: It will be generated
  const testing = new Testing();

  await t.step("Method howAreYou must work and return 'OK'", async () => {
    // @ts-ignore: just ignore me
    const response = await testing.howAreYou({ p0: "test" });
    assert(response.result === "OK");
  });

  await t.step("Method updateClientValue must return undefined", async () => {
    // @ts-ignore: just ignore me
    const response = await testing.updateClientValue({ p0: 33 });
    assert(response.result === undefined);
  });

  await t.step("Method getClientValue must return 33", async () => {
    // @ts-ignore: just ignore me
    const response = await testing.getClientValue();
    assert(response.result === 33);
  });

  await t.step(
    "Method concatPlz2 must work and return 'ABCBCA'",
    async () => {
      const r = await testing.concatPlz2({ p0: "ABC", p1: "BCA" });
      assert(r.result === "ABCBCA");
    },
  );

  await t.step(
    'Method getObject must work and return { a: 1, b: "hola" }',
    async () => {
      const obj = (await testing.getObject()).result;
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
      assert((await testing.addNumbers({ p0: 2, p1: 3 })).result === 5);
      assert((await testing.addNumbers({ p0: -1, p1: 1 })).result === 0);
    },
  );

  await t.step("Method greet must return a greeting message I", async () => {
    // @ts-ignore: just ignore me
    const juan = (await testing.greet({ p0: "Juan" })).result;
    // @ts-ignore: just ignore me
    assert(
      juan === "Hola, Juan!",
      "Message should be 'Hola, Juan!'",
    );
  });

  await t.step("Method greet must return a greeting message II", async () => {
    const result = (await testing.greet({ p0: "Ana", p1: "Buenos días" })).result;
    // @ts-ignore: just ignore me
    assert(
      result === "Buenos días, Ana!",
      "Message should be 'Buenos (2), Ana!'",
    );
  });

  await t.step(
    "Method multiply must return the product of two numbers",
    async () => {
      // @ts-ignore: just ignore me
      assert((await testing.multiply({ p0: 3, p1: 4 })).result === 12);
      // @ts-ignore: just ignore me
      assert((await testing.multiply({ p0: -2, p1: 5 })).result === -10);
    },
  );

  await t.step(
    "Method reverseString must return the reversed string I",
    async () => {
      // @ts-ignore: just ignore me
      assert((await testing.reverseString({ p0: "hello" })).result === "olleh");
    },
  );

  await t.step(
    "Method reverseString must return the reversed string II",
    async () => {
      const result = (await testing.reverseString({ p0: "" })).result;
      // @ts-ignore: just ignore me
      assert(result === "");
    },
  );

  await t.step(
    "Method isEven must return true for even numbers",
    async () => {
      // @ts-ignore: just ignore me
      assert((await testing.isEven({ p0: 4 })).result === true);
      // @ts-ignore: just ignore me
      assert((await testing.isEven({ p0: 5 })).result === false);
    },
  );

  await t.step(
    "Method getLength must return the length of the array I",
    async () => {
      // @ts-ignore: just ignore me
      assert((await testing.getLength({ p0: [1, 2, 3] })).result === 3);
    },
  );

  await t.step(
    "Method getLength must return the length of the array II",
    async () => {
      const result = await testing.getLength({ p0: [] });
      // @ts-ignore: just ignore me
      assert(result.result === 0);
    },
  );

  await t.step(
    "Method formatDate must return the ISO string of the date",
    async () => {
      // @ts-ignore: just ignore me
      const date = new Date("2024-01-01T00:00:00Z");
      const res = (await testing.formatDate({ p0: date })).result;
      assertInstanceOf(res, Date);
      // @ts-ignore: just ignore me
      assert(res.toISOString() === "2024-01-01T00:00:00.000Z");
    },
  );

  await t.step(
    "Method checkVoid must return undefined",
    async () => {
      // @ts-ignore: just ignore me
      const res = (await testing.checkVoid()).result;
      // @ts-ignore: just ignore me
      // FIXME: this is a bad result, res must be void or undefined
      assert(res === undefined);
    },
  );

  await t.step(
    "Method getValues must return an empty array of strings",
    async () => {
      // @ts-ignore: just ignore me
      const res = (await testing.getValues()).result;
      assertInstanceOf(res, Array);
      // @ts-ignore: just ignore me
      assert(res.length === 0);
    },
  );

  await t.step(
    "Method addValue must push the value to the array of strings",
    async () => {
      // @ts-ignore: just ignore me
      const res = (await testing.addValue({ p0: "Hola Mundo" })).result;
      // @ts-ignore: just ignore me
      assert(res === undefined);
    },
  );

  await t.step(
    "Method getValues must return an array of strings with the previous value pushed",
    async () => {
      // @ts-ignore: just ignore me
      const res = (await testing.getValues()).result;
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
      const res = (await testing.addUser({ p0: usr })).result;
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
      const res = (await testing.checkRequest()).result;
      assert(res === true);
    },
  );

  await t.step(
    "Method checkRequest2 must return true if its first argument is true and the latest one is a Request instance",
    async () => {
      // @ts-ignore: just ignore me
      const res = (await testing.checkRequest2({ p0: true })).result;
      assert(res === true);
    },
  );

  await t.step(
    "Method checkRequest2 must return false if its first argument is false and the latest one is a Request instance",
    async () => {
      // @ts-ignore: just ignore me
      const res = (await testing.checkRequest2({ p0: false })).result;
      assert(res === false);
    },
  );
});
