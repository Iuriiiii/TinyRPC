import { stringToUID } from "../src/utils/mod.ts";

function stringToUniqueId(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // Asegurarte de que el resultado sea positivo
  return Math.abs(hash);
}

let textToTest = "SuperMegaText";

for (let i = 0; i < 1; i++) {
  textToTest += textToTest;
}

Deno.bench(`StringToUID vs ${textToTest.length} text length`, () => {
  stringToUID(textToTest);
});

Deno.bench(`stringToUniqueId vs ${textToTest.length} text length`, () => {
  stringToUniqueId(textToTest);
});
