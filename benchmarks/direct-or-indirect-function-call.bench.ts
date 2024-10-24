function doSomething(arg: number) {
  return arg + 1;
}

function doSomething2(arg: number) {
  return arg + 1;
}

const value = 33;

Deno.bench("Direct function call", () => {
  doSomething2(doSomething(1));
});

Deno.bench("Indirect function call", () => {
  const v = doSomething(1);
  doSomething2(v);
});
