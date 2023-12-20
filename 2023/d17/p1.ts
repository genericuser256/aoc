import {
  cloneDeep,
  first,
  isEqual,
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
  dirToStr,
  generateRange,
  getDim,
  getSurrondingPoints,
  getSurrondingPointsOrth,
  isIn,
  mannhattan,
  multAcc,
  printGrid,
  repeat,
  stringify,
  subPts,
  transpose,
  ty,
  valueAt,
} from "../utils/utils";

type Tile = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const seenPts = new Set<string>();
const followed = new Set<string>();

function parseData(data: string) {
  return data
    .split("\n")
    .map((x) => x.split("").map((x) => parseInt(x))) as any as Tile[][];
}

function followPath(
  grid: Tile[][],
  costGrid: number[][],
  pt: Pt2d,
  dir: Pt2d,
  prevPt: Pt2d,
  prevCost = 0,
  length = 0
): [number, string[]] {
  if (!isIn(grid, pt) || length >= 3) {
    return [Infinity, []];
  }
  const fkey = `${stringify(pt)}-${stringify(dir)}`;
  const key = stringify(pt);
  const v: Tile = grid.ptAt(pt);
  if (followed.has(fkey)) {
    return [Infinity, []];
  }

  costGrid.setAt(pt, Math.min(costGrid.ptAt(pt), prevCost + v));
  prevCost = costGrid.ptAt(pt);
  printGrid(costGrid);
  console.log(
    stringify(prevPt),
    "->",
    stringify(pt),
    "l",
    length,
    "d",
    stringify(dir)
  );
  console.log();
  // console.log(v, key);
  if (pt.x === grid[0].length - 1 && pt.y === grid.length - 1) {
    // console.log("hi", cost, v);
    return [prevCost + v, [key]];
  }

  seenPts.add(stringify(pt));
  followed.add(fkey);

  const [straight, straightPath] = followPath(
    grid,
    costGrid,
    addPts(pt, dir),
    dir,
    pt,
    prevCost,
    length + 1
  );
  let newDir = dir.x ? { x: 0, y: -1 } : { x: -1, y: 0 };
  const [left, leftPath] = followPath(
    grid,
    costGrid,
    addPts(pt, newDir),
    newDir,
    pt,
    prevCost
  );
  newDir = dir.x ? { x: 0, y: 1 } : { x: 1, y: 0 };
  const [right, rightPath] = followPath(
    grid,
    costGrid,
    addPts(pt, newDir),
    newDir,
    pt,
    prevCost
  );
  if (straight === left && straight === right && straight === Infinity) {
    return [Infinity, []];
  }

  // console.log(
  //   straight !== Infinity ? straight : "",
  //   left !== Infinity ? left : "",
  //   right !== Infinity ? right : ""
  // );
  if (straight <= left && straight <= right) {
    // console.log("s", length, key, dirToStr(dir));
    return [straight, [key, ...straightPath]];
  }
  if (left <= straight && left <= right) {
    // console.log("l", length, key, dirToStr(dir));
    return [left, [key, ...leftPath]];
  }
  if (right <= left && right <= straight) {
    // console.log("r", length, key, dirToStr(dir));
    return [right, [key, ...rightPath]];
  }
  throw "no no no";
}

function run(input: string) {
  const data = parseData(input);
  const costGrid = data.map((x) => x.map((y) => Infinity));
  followPath(
    data,
    costGrid,
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    -1 * data[0][0],
    -1
  );
  followPath(
    data,
    costGrid,
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    -1 * data[0][0],
    -1
  );
  printGrid(costGrid);
  return costGrid.ptAt(getDim(costGrid));
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
