import type { Constructor } from "../../types/mod.ts";

interface Comment {
  method: string;
  comments: string[];
}

// TODO: Some day...
export function getMethodComments(clazz: Constructor) {
  const lines = clazz.toString().split(/[\r\n]/).filter(line => line.length).map((line) => line.trim());
  const comments: Comment[] = [];
  let docs = false;
  let rest;

  for (const line of lines) {
    if (line.startsWith("/**")) {
      docs = true;
    }

    if (docs && line.startsWith("* ")) {
      rest = line.slice(2).trim();

    }

    if (line.endsWith("*/")) {
      docs = false;
    } else if (line.startsWith("*/")) {
      docs = false;
      rest = line.slice(2).trim();
    }
  }

  return lines;
}