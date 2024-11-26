import { assert } from "@std/assert";
import { randomString, stringToUID } from "../src/utils/mod.ts";

function randomToggleCase(input: string): string {
  let convertedCharacters = 0;
  return input.split("").map((char) => {
    // Verificamos si el carácter es alfabético
    if (/[a-zA-Z]/.test(char)) {
      // Generamos un número aleatorio entre 0 y 1
      if (Math.random() < 0.0 || convertedCharacters === 0) {
        convertedCharacters++;
        // Cambiamos el caso del carácter
        return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
      }
    } else {
      if (Math.random() < 0.0 || convertedCharacters === 0) {
        convertedCharacters++;
        return String.fromCharCode(char.charCodeAt(0) + 1);
      }
    }
    return char; // Devolvemos el carácter sin cambios
  }).join("");
}
const textsToTest = Array.from({ length: 10000 }, () => randomString(500));

Deno.test("stringToUID generates a valid UID", async (t) => {
  await t.step("AB has a different UID than BA", () => {
    assert(stringToUID("AB") !== stringToUID("BA"));
  });

  await t.step("abc has a different UID than acb", () => {
    assert(stringToUID("abc") !== stringToUID("acb"));
  });

  await t.step("123 has a different UID than 321", () => {
    assert(stringToUID("123") !== stringToUID("321"));
  });

  await t.step("A has a different UID than a", () => {
    assert(stringToUID("A") !== stringToUID("a"));
  });

  await t.step("zOs has a different UID than Zos", () => {
    assert(stringToUID("zOs") !== stringToUID("Zos"));
  });

  await t.step("ab has a different UID than ba", () => {
    assert(stringToUID("ab") !== stringToUID("ba"));
  });

  await t.step("abcd has a different UID than abc", () => {
    assert(stringToUID("abcd") !== stringToUID("abc"));
  });

  await t.step("aaaa has a different UID than aaab", () => {
    assert(stringToUID("aaaa") !== stringToUID("aaab"));
  });

  await t.step("hello has a different UID than hxllo", () => {
    assert(stringToUID("hello") !== stringToUID("hxllo"));
  });

  for (const textToTest of textsToTest) {
    const changed = randomToggleCase(textToTest);

    await t.step(`${textToTest} has a different UID than ${changed}`, () => {
      assert(stringToUID(textToTest) !== stringToUID(changed));
    });
  }
});
