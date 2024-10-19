
// import { gunzip, gzip } from "deno:zlib";
// import { Buffer } from "deno:io";
// import { encodeBase64 } from "deno:base64";

// const argument = {
//   a: "hola cómo estás",
//   b: 222,
//   c: 3.3,
//   d: { a: "Necesito azucar", b: { a: "Yo necesito café" } },
// };

// const serializedValue = serializeValue(argument);
// const jsonSerialized = JSON.stringify(serializedValue);
// const encoder = new TextEncoder();
// const buffer = encoder.encode(jsonSerialized);
// const zip = gzip(buffer, { level: 9 });
// const zipBase64 = encodeBase64(zip);
// const unzip = gunzip(zip);

// console.log("DEBUG ON main.ts:104", jsonSerialized.length);

// const information = {
//   jsonSize: jsonSerialized.length,
//   bufferSize: buffer.byteLength,
//   zipSize: zip.byteLength,
//   zipBase64Size: zipBase64.length,
//   unzipSize: unzip.length,
// };

// console.log(information);

// console.log(serializedValue);
