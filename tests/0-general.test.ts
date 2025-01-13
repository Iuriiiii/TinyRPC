import { assertObjectMatch, test } from "@inspatial/test";
import { enums, modules, structures } from "../src/singletons/mod.ts";
import { Expose } from "../src/decorators/expose.decorator.ts";
import { Member } from "../src/decorators/member.decorator.ts";
import { Module } from "../src/decorators/module.decorator.ts";
import { Export } from "../src/decorators/export.decorator.ts";
import { expose, SerializableClass } from "../mod.ts";
import type { StructureMetadata } from "../types.ts";

// Test structures
@Expose()
class TestStructure extends SerializableClass {
  @Member()
  public prop: string = "test";
}

// Test module
@Module("TestModule")
class TestModule {
  @Export()
  public testMethod(): string {
    return "test";
  }
}

// Test enum
enum TestEnum {
  A = "A",
  B = "B",
}

test("Structures singleton should store structure metadata", () => {
  const structureMetadata = structures.find((s) => s.name === TestStructure.name)!;

  assertObjectMatch(
    structureMetadata,
    {
      name: "TestStructure",
      constructor: TestStructure,
      isInterface: false,
      members: [{
        name: "prop",
        dataType: String,
        optional: false,
      }],
    } satisfies StructureMetadata,
  );
});

test("Modules singleton should store module metadata", () => {
  const moduleMetadata = modules.find((m) => m.name === TestModule.name)!;

  assertObjectMatch(moduleMetadata, {
    name: TestModule.name,
    constructor: TestModule,
    moduleName: "TestModule",
    methods: [{
      name: "testMethod",
    }],
  });
});

test("Enums singleton should store enum metadata", () => {
  expose({ enum: TestEnum, as: "TestEnum" });

  const enumMetadata = enums.find((m) => m.name === "TestEnum")!;
  assertObjectMatch(enumMetadata, {
    name: "TestEnum",
    value: TestEnum,
  });
});
