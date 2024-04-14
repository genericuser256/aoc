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
  strToDir,
  stringify,
  subPts,
  transpose,
  ty,
  valueAt,
} from "../utils/utils";

type Instruction = {
  dir: Pt2d;
  amount: number;
  code: string;
};

type Tile = "." | "#" | "_";

function parseData(data: string) {
  return data
    .split("\n")
    .map((x) => x.match(/(\w) (\d+) \((#[\w\d]+)\)/)!)
    .map(([_, a, b, c]) => ({
      dir: strToDir(a),
      amount: parseInt(b),
      code: c,
    })) as any as Instruction[];
}

function followInstructions(instructions: Instruction[], grid: Tile[][]) {
  let pt: Pt2d = { x: 0, y: 0 };
  instructions.forEach(({ dir, amount, code }) => {
    while (amount > 0) {
      const dim = getDim(grid);
      while (pt.y < 0) {
        grid.unshift(repeat(dim.x + 1, "."));
        pt.y += 1;
      }
      while (pt.x < 0) {
        grid.forEach((row) => row.unshift("."));
        pt.x += 1;
      }
      while (!grid[pt.y]) {
        grid.push(repeat(dim.x + 1, "."));
      }
      while (!isIn(grid, pt)) {
        grid.forEach((row) => row.push("."));
      }
      grid.setAt(pt, "#");
      pt = addPts(pt, dir);
      amount -= 1;
    }
  });
}

function floodFill(grid: Tile[][], pt: Pt2d) {
  if (grid.ptAt(pt) !== ".") {
    return;
  }

  grid.setAt(pt, "_");
  const pts = getSurrondingPointsOrth(pt, grid);
  while (pts.length) {
    pt = pts.pop()!;
    if (grid.ptAt(pt) !== ".") {
      continue;
    }
    grid.setAt(pt, "_");
    pts.push(...getSurrondingPoints(pt, grid));
  }
}

function fillGaps(grid: Tile[][]) {
  const dim = getDim(grid);

  for (let x = 0; x <= dim.x; x++) {
    floodFill(grid, { y: 0, x });
    floodFill(grid, { y: dim.y, x });
  }
  for (let y = 0; y <= dim.y; y++) {
    floodFill(grid, { y, x: 0 });
    floodFill(grid, { y, x: dim.x });
  }
}

function run(input: string) {
  const data = parseData(input);
  const grid: Tile[][] = [[]];
  followInstructions(data, grid);
  printGrid(grid, { space: false });
  fillGaps(grid);
  printGrid(grid, { space: false });

  return sum(grid.map((row) => row.filter((c) => c !== "_").length));
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
