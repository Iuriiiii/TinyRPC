let a = 0;
const limit = 999;

function _increase() {
  a++;
}

function increase() {
  if (a > limit) {
    throw new Error("error");
  }

  a++;
}
function decrease() {
  a--;
}

function errorValue() {
  return { error: a > limit, value: a++ };
}

Deno.bench("error handling", () => {
  try {
    increase();
  } catch (_error) {
    decrease();
  }
});

Deno.bench("error value report", () => {
  if (errorValue().error) {
    decrease();
  } else {
    _increase();
  }
});
