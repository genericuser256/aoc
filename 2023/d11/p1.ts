import { first, last, max, min, sortBy, sum, uniq } from "lodash";
import {
  Pt2d,
  between,
  getSurrondingPoints,
  getSurrondingPointsOrth,
  multAcc,
  stringify,
  ty,
  valueAt,
} from "../utils/utils";

function parse(data: string): Array<string[]> {
  let arr = data
    .split("\n")
    .flatMap((x) =>
      /^\.+$/.test(x) ? [x.split(""), x.split("")] : [x.split("")]
    );
  for (let x = 0; x < arr[0].length; x++) {
    if (arr.every((line) => line[x] === ".")) {
      arr.forEach((line) => line.splice(x, 1, ".", "."));
      x++;
    }
  }
  return arr;
}

function findGalaxies(grid: string[][]): Pt2d[] {
  const ret: Pt2d[] = [];

  for (let y = 0; y < grid.length; y++) {
    const line = grid[y];

    for (let x = 0; x < line.length; x++) {
      if (grid.ptAt({ x, y }) === "#") {
        ret.push({ x, y });
      }
    }
  }
  return ret;
}

function permute(pts: Pt2d[]) {
  return pts.flatMap((from, i1) =>
    pts.map((to, i2) => (i1 < i2 ? { from, to, i1, i2 } : undefined)).filter(ty)
  );
}

function distance(grid: string[][], from: Pt2d, to: Pt2d): number {
  return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
}

function run(data: string) {
  const parsedData = parse(data);
  const z = parsedData.map((x) => x.join("")).join("\n");
  // console.log(findGalaxies(parsedData))
  const permutes = permute(findGalaxies(parsedData));
  // console.log(permutes);
  return sum(
    permutes.map((x) => {
      const d = distance(parsedData, x.from, x.to);
      // console.log(x.i1, x.i2, d);
      return d;
    })
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
