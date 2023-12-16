let running = true;
let j = 0;
let i = 0;

function* inner(run: boolean) {
  i = 0;
  while (i < 10 && run) {
    i++;
    // console.log(i);
    yield i;
  }
}

function* bla() {
  let run = true;
  while (j < 10) {
    j++;
    console.log({ j });
    if (j > 8) run = false;
    yield inner(run);
  }
}

// const lol = bla();
// lol.next();
// lol.next();
// lol.next();
// lol.next();
// lol.next();

for (let ab of bla()) {
  for (let hehe of ab) {
    // if (j === 3 && i === 4) {
    //   j = 10;
    //   i = 10;
    // }
    console.log({ hehe });
  }
}
