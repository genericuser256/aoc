import { sum } from "lodash";

function run(data: string) {
  const seen = new Set();
  const lines = data.split("\n").map((line) => line.split(""));
  let sumAcc = 0;
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    // const things = line.match(/(\d+|%|\*|#|&|\$|@|\/|=|\+|-)/g);
    for (let x = 0; x < line.length; x++) {
      let c = line[x];
      if (isNaN(parseInt(c))) {
        continue;
      }

      let acc = 0;
      const start = x;
      while (!isNaN(parseInt(c))) {
        acc *= 10;
        acc += parseInt(c);
        x += 1;
        c = line[x];
      }

      if (seen.has(acc)) {
        // console.log("seen", acc)
      } else {
        seen.add(acc);
      }

      let found = false;
      for (let i = -1; i < 2; i++) {
        for (let x2 = start - 1; x2 <= x; x2++) {
          if (lines[y + i] && lines[y + i][x2]) {
            // console.log("checking", lines[y + i][x2], "for", acc);
            if (
              ["%", "*", "#", "&", "$", "@", "/", "=", "+", "-"].includes(
                lines[y + i][x2]
              )
            ) {
              found = true;
              console.log("found1", acc, y, i, x, x2, lines[y + i][x2]);
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }
      if (found) {
        // console.log("found", acc);
        sumAcc += acc;
      } else {
        console.log(acc);
      }
    }
  }
  return sumAcc;
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
