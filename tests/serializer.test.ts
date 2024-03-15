import {
  assert,
  assertEquals,
  assertExists,
  assertInstanceOf,
  assertMatch,
  assertObjectMatch,
} from "deno:assert";
import { serializeValue } from "../src/mod.ts";

// class Testing extends Serializable {
//   value = 33;
//   #adios = "hola";

//   testarray = [1, "2", new Date()];

//   date: Date | string = new Date();
// }

// class Testing2 extends Serializable {
//   value = [new Testing()];
// }

// const testClass = new Testing();
//   const serializedA = testClass.serialize();
//   const classDate = (testClass.testarray[2] as Date).toISOString();
//   const value = 33;
//   const testarray = [1, "2", { dataType: "date", value: classDate }];
//   const date = {
//     dataType: "date",
//     value: (testClass.date as Date).toISOString(),
//   };

//   assertObjectMatch(serializedA, {
//     value,
//     testarray,
//     date,
//   });

Deno.test("Primitives Serialization", async (t) => {
  await t.step("String value", () => {
    const serializableValue = "Hola cómo estás";
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, serializableValue);
  });

  await t.step("null === null", () => {
    const serializableValue = null;
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, serializableValue);
  });

  await t.step("NaN === null", () => {
    const serializableValue = NaN;
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, null);
  });

  await t.step("Infinity === null", () => {
    const serializableValue = Infinity;
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, null);
  });

  await t.step("-Infinity === null", () => {
    const serializableValue = -Infinity;
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, null);
  });

  await t.step("1 === 1", () => {
    const serializableValue = 1;
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, serializableValue);
  });

  await t.step("1.1 === 1.1", () => {
    const serializableValue = 1.1;
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, serializableValue);
  });

  await t.step(`"1.1" === "1.1"`, () => {
    const serializableValue = "1.1";
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, serializableValue);
  });

  await t.step(`false === false`, () => {
    const serializableValue = false;
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, serializableValue);
  });

  await t.step(`true === true`, () => {
    const serializableValue = true;
    const serializedValue = serializeValue(serializableValue);

    assertEquals(serializedValue, serializableValue);
  });

  await t.step("{} === {}", () => {
    const serializableValue = {};
    const serializedValue = serializeValue(serializableValue);

    // @ts-ignore: Assert exists
    assertExists(serializedValue.dataType);
    // @ts-ignore: Assert exists
    assertExists(serializedValue.instanceId);
    // @ts-ignore: Assert exists
    assertExists(serializedValue.value);
  });
});

Deno.test("Object Serialization", async (t) => {
  await t.step("Object with a field with value 1", () => {
    const serializableValue = { equisDe: 1 };
    const serializedValue = serializeValue(serializableValue);

    assertInstanceOf(serializedValue, Object);
    // @ts-ignore: Check members
    assertExists(serializedValue.dataType);
    // @ts-ignore: Check members
    assertExists(serializedValue.value);
    // @ts-ignore: Check members
    assertExists(serializedValue.instanceId);
    // @ts-ignore: Check members
    assert(typeof serializedValue.instanceId === "string");
    // @ts-ignore: Check members
    assert(serializedValue.value instanceof Object);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.equisDe);
    // @ts-ignore: Check members
    assert(serializedValue.value.equisDe === 1);
  });

  await t.step("Object with referencing another object", () => {
    const a = { value: 1 };
    const serializableValue = { refA: a };
    const serializedValue = serializeValue(serializableValue);

    assertInstanceOf(serializedValue, Object);

    // @ts-ignore: Check members
    assertExists(serializedValue.dataType);
    // @ts-ignore: Check members
    assertExists(serializedValue.value);
    // @ts-ignore: Check members
    assertExists(serializedValue.instanceId);
    // @ts-ignore: Check members
    assert(typeof serializedValue.instanceId === "string");
    // @ts-ignore: Check members
    assert(serializedValue.value instanceof Object);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA.dataType);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA.value);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA.instanceId);
    // @ts-ignore: Check members
    assert(typeof serializedValue.value.refA.instanceId === "string");
    // @ts-ignore: Check members
    assert(serializedValue.value.refA.value instanceof Object);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA.value.value === 1);
  });

  await t.step("Object with referencing another object", () => {
    const a = { value: 1 };
    const serializableValue = { refA: a, a };
    const serializedValue = serializeValue(serializableValue);

    assertInstanceOf(serializedValue, Object);

    // @ts-ignore: Check members
    assertExists(serializedValue.dataType);
    // @ts-ignore: Check members
    assertExists(serializedValue.value);
    // @ts-ignore: Check members
    assertExists(serializedValue.instanceId);
    // @ts-ignore: Check members
    assert(typeof serializedValue.instanceId === "string");
    // @ts-ignore: Check members
    assert(serializedValue.value instanceof Object);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA.dataType);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA.value);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA.instanceId);
    // @ts-ignore: Check members
    assert(typeof serializedValue.value.refA.instanceId === "string");
    // @ts-ignore: Check members
    assert(serializedValue.value.refA.value instanceof Object);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.refA.value.value === 1);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.a.dataType);
    // @ts-ignore: Check members
    assertExists(serializedValue.value.a.value);
    // @ts-ignore: Check members
    assert(serializedValue.value.a.dataType === "instance");
    // @ts-ignore: Check members
    assertExists(serializedValue.value.a.value);
    // @ts-ignore: Check members
    assert(typeof serializedValue.value.a.value === "string");
  });
});
