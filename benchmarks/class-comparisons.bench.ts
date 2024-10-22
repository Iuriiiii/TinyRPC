// deno-lint-ignore-file no-unused-vars
import { assert } from "jsr:assert";

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

Deno.bench("instanceof", () => {
  assert(a instanceof A);
});

Deno.bench("strict comparison constructor", () => {
  assert(a.constructor === A);
});
