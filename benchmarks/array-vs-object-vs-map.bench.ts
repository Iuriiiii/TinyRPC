function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

class A {
}

class B {
}

class C {
}

class D {
}

class E {
}
class F {
}
class G {
}
class H {
}
class I {
}
class J {
}
class K {
}
class L {
}

const a = new A();
const b = new B();
const c = new C();
const d = new D();
const e = new E();
const f = new F();
const g = new G();
const h = new H();
const i = new I();
const j = new J();
const k = new K();
const l = new L();

const array = shuffle([
  { name: "a", instance: a },
  { name: "b", instance: b },
  { name: "c", instance: c },
  { name: "d", instance: d },
  { name: "e", instance: e },
  { name: "f", instance: f },
  { name: "g", instance: g },
  { name: "h", instance: h },
  { name: "i", instance: i },
  { name: "j", instance: j },
  { name: "k", instance: k },
  { name: "l", instance: l },
]);
const map = new Map();
map.set("a", a);
map.set("b", b);
map.set("c", c);
map.set("d", d);
map.set("e", e);
map.set("f", f);
map.set("g", g);
map.set("h", h);
map.set("i", i);
map.set("j", j);
map.set("k", k);
map.set("l", l);

const obj = {
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  i,
  j,
  k,
  l,
};

const searchPath = shuffle([
  "a",
  "b",
  "c",
  "d",
  "e",
]);

Deno.bench("array", () => {
  for (const path of searchPath) {
    // deno-lint-ignore no-unused-vars
    const a = array.find((item) => item.name === path);
  }
});

Deno.bench("map", () => {
  for (const path of searchPath) {
    // deno-lint-ignore no-unused-vars
    const a = map.get(path);
  }
});

Deno.bench("object", () => {
  for (const path of searchPath) {
    // @ts-ignore: key access
    // deno-lint-ignore no-unused-vars
    const a = obj[path];
  }
});

// CPU | unknown (i5 11400)
// Runtime | Deno 2.0.2 (x86_64-pc-windows-msvc)

// file:///C:/Users/oscar/Desktop/TinyRPC/benchmarks/array-vs-object-vs-map.bench.ts

// benchmark   time/iter (avg)        iter/s      (min … max)           p75      p99     p995
// ----------- ----------------------------- --------------------- --------------------------
// array               38.3 ns    26,100,000 ( 37.8 ns …  55.1 ns)  38.2 ns  42.3 ns  42.9 ns
// map                  4.6 ns   219,500,000 (  4.3 ns …  13.6 ns)   4.6 ns   5.4 ns   5.6 ns
// object              43.5 ns    23,000,000 ( 42.9 ns …  73.3 ns)  43.4 ns  48.1 ns  49.6 ns
