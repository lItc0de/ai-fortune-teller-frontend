// let running = true;
// let j = 0;
// let i = 0;

// function* inner(run: boolean) {
//   i = 0;
//   while (i < 10 && run) {
//     i++;
//     // console.log(i);
//     yield i;
//   }
// }

// function* bla() {
//   let run = true;
//   while (j < 10) {
//     j++;
//     console.log({ j });
//     if (j > 8) run = false;
//     yield inner(run);
//   }
// }

// // const lol = bla();
// // lol.next();
// // lol.next();
// // lol.next();
// // lol.next();
// // lol.next();

// for (let ab of bla()) {
//   for (let hehe of ab) {
//     // if (j === 3 && i === 4) {
//     //   j = 10;
//     //   i = 10;
//     // }
//     console.log({ hehe });
//   }
// }

const test = document.getElementById("test") as HTMLDivElement;

test.addEventListener("animationstart", () => console.log("started"));
test.addEventListener("animationend", () => console.log("finished"));

const animation = test.animate(
  [
    { transform: "rotate(0) translate3D(-50%, -50%, 0)", color: "#000" },
    { color: "#431236", offset: 0.3 },
    { transform: "rotate(360deg) translate3D(-50%, -50%, 0)", color: "#000" },
  ],
  {
    duration: 3000,
  }
);

animation.addEventListener("finish", function () {
  test.remove();
});
