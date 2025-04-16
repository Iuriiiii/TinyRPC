import { assert } from "@std/assert";
import { calculateDatatype, DatatypeType } from "../src/utils/calculate-datatype.util.ts";
import { SerializableClass } from "@online/packager";
import { Expose } from "../src/mod.ts";

Deno.test("calculate datatype", async (t) => {
  await t.step("From function", () => {
    const result = calculateDatatype(() => null);

    assert(result.type === DatatypeType.Custom, `Custom type expected, got ${result.type}.`);
    assert(result.dataType === null, "Invalid datatype.");
  });

  await t.step("From object", () => {
    const dt = {};
    const result = calculateDatatype(dt);

    assert(result.type === DatatypeType.Object, `Object type expected, got ${result.type}.`);
    assert(result.dataType === dt, "Invalid datatype.");
  });

  await t.step("From class", () => {
    @Expose()
    class TestClass extends SerializableClass {}
    const result = calculateDatatype(TestClass);

    assert(result.type === DatatypeType.Structure, `Custom type expected, got ${result.type}.`);
    assert(result.dataType === TestClass, "Invalid datatype.");
  });
});
