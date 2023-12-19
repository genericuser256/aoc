import {
  cloneDeep,
  first,
  last,
  max,
  maxBy,
  min,
  sortBy,
  sum,
  uniq,
} from "lodash";
import {
  Pt2d,
  addPts,
  between,
  generateRange,
  getSurrondingPoints,
  getSurrondingPointsOrth,
  isIn,
  multAcc,
  repeat,
  stringify,
  transpose,
  ty,
  valueAt,
} from "../utils/utils";

type Tile = "." | "\\" | "/" | "-" | "|";

const seenPts = new Set<string>();
const followed = new Set<string>();

function parseData(data: string) {
  return data.split("\n").map((x) => x.split("")) as any as Tile[][];
}

function followPath(grid: Tile[][], start: Pt2d, dir: Pt2d) {
  let pt = { ...start };
  while (isIn(grid, pt)) {
    const key = `${stringify(pt)}-${stringify(dir)}`;
    if (followed.has(key)) {
      return;
    }

    seenPts.add(stringify(pt));
    followed.add(key);

    const v: Tile = grid.ptAt(pt);
    // console.log(key, v);
    if (v === ".") {
      pt = addPts(pt, dir);
      continue;
    }

    if (v === "\\") {
      if (dir.x > 0) {
        dir = { x: 0, y: 1 };
      } else if (dir.x < 0) {
        dir = { x: 0, y: -1 };
      } else if (dir.y > 0) {
        dir = { x: 1, y: 0 };
      } else if (dir.y < 0) {
        dir = { x: -1, y: 0 };
      }
      pt = addPts(pt, dir);
      continue;
    }

    if (v === "/") {
      if (dir.x > 0) {
        dir = { x: 0, y: -1 };
      } else if (dir.x < 0) {
        dir = { x: 0, y: 1 };
      } else if (dir.y > 0) {
        dir = { x: -1, y: 0 };
      } else if (dir.y < 0) {
        dir = { x: 1, y: 0 };
      }
      pt = addPts(pt, dir);
      continue;
    }

    if (v === "-") {
      if (dir.x) {
        pt = addPts(pt, dir);
        continue;
      } else {
        followPath(grid, addPts(pt, { x: -1, y: 0 }), { x: -1, y: 0 });
        followPath(grid, addPts(pt, { x: 1, y: 0 }), { x: 1, y: 0 });
        break;
      }
    }

    if (v === "|") {
      if (dir.y) {
        pt = addPts(pt, dir);
        continue;
      } else {
        followPath(grid, addPts(pt, { x: 0, y: -1 }), { x: 0, y: -1 });
        followPath(grid, addPts(pt, { x: 0, y: 1 }), { x: 0, y: 1 });
        break;
      }
    }
  }
}

function run(input: string) {
  const data = parseData(input);
  const n = data.length;
  const m = data[0].length;
  let most = 0;
  for (let index = 0; index < n; index++) {
    seenPts.clear();
    followed.clear();
    followPath(data, { x: 0, y: index }, { x: 1, y: 0 });
    most = Math.max(most, seenPts.size);
    seenPts.clear();
    followed.clear();
    followPath(data, { x: m - 1, y: index }, { x: -1, y: 0 });
    most = Math.max(most, seenPts.size);
  }
  for (let index = 0; index < m; index++) {
    seenPts.clear();
    followed.clear();
    followPath(data, { x: index, y: 0 }, { x: 0, y: 1 });
    most = Math.max(most, seenPts.size);
    seenPts.clear();
    followed.clear();
    followPath(data, { x: index, y: n - 1 }, { x: 0, y: -1 });
    most = Math.max(most, seenPts.size);
  }
  return most;
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
