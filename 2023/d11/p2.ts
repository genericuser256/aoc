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

function parse(data: string): Pt2d[] {
  let grid = data.split("\n").map((x) => x.split(""));
  const ret: Pt2d[] = [];

  let realY = 0;
  for (let y = 0; y < grid.length; y++) {
    const line = grid[y];
    if (line.every((z) => z === ".")) {
      realY += 1_000_000;
      continue;
    }

    let realX = 0;
    for (let x = 0; x < line.length; x++) {
      if (grid.every((l) => l[x] === ".")) {
        realX += 1_000_000;
        continue;
      }

      if (grid.ptAt({ x, y }) === "#") {
        ret.push({ x: realX, y: realY });
      }
      realX++;
    }
    realY++;
  }
  return ret;
}

function permute(pts: Pt2d[]) {
  return pts.flatMap((from, i1) =>
    pts.map((to, i2) => (i1 < i2 ? { from, to, i1, i2 } : undefined)).filter(ty)
  );
}

function distance(from: Pt2d, to: Pt2d): number {
  return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
}

function run(data: string) {
  const parsedData = parse(data);
  // const z = parsedData.map((x) => x.join("")).join("\n");
  // console.log(findGalaxies(parsedData))
  const permutes = permute(parsedData);
  // console.log(permutes);
  return sum(
    permutes.map((x) => {
      const d = distance(x.from, x.to);
      // console.log(x.i1, x.i2, d);
      return d;
    })
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
