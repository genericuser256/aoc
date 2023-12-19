import { first, last, max, min, sortBy, sum, uniq } from "lodash";
import {
  Pt2d,
  between,
  getSurrondingPoints,
  getSurrondingPointsOrth,
  multAcc,
  stringify,
  valueAt,
} from "../utils/utils";

enum Tile {
  // vertical pipe connecting north and south.
  Vertical = "|",
  // horizontal pipe connecting east and west.
  Horizontal = "-",
  // 90-degree bend connecting north and east.
  NE = "L",
  // 90-degree bend connecting north and west.
  NW = "J",
  // 90-degree bend connecting south and west.
  SW = "7",
  // 90-degree bend connecting south and east.
  SE = "F",
  // is ground; there is no pipe in this tile.
  Ground = ".",
  // is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
  Start = "S",
}

const TileMap: Record<string, Tile> = {
  "|": Tile.Vertical,
  "-": Tile.Horizontal,
  L: Tile.NE,
  J: Tile.NW,
  "7": Tile.SW,
  F: Tile.SE,
  ".": Tile.Ground,
  S: Tile.Start,
};

function parse(data: string): Array<Tile[]> {
  return data.split("\n").map((x) => x.split("").map((x) => TileMap[x]));
}

function getStart(grid: Array<Tile[]>): Pt2d {
  for (let y = 0; y < grid.length; y++) {
    const line = grid[y];
    for (let x = 0; x < line.length; x++) {
      if (grid.ptAt({ x, y }) === Tile.Start) {
        return { x, y };
      }
    }
  }
  throw "NO START";
}

function canMoveTo(grid: Array<Tile[]>, from: Pt2d, to: Pt2d): boolean {
  const fat: Tile = grid.ptAt(from);
  const tat: Tile = grid.ptAt(to);
  if (fat === Tile.Start || tat === Tile.Start) {
    return true;
  }

  from.x === 90 &&
    from.y === 69 &&
    console.log(`${stringify(from)} ${stringify(to)} ${fat} ${tat}`);

  if (to.y === from.y) {
    const s = from.x < to.x ? `${fat}${tat}` : `${tat}${fat}`;
    const yes = ["-J", "-7", "--", "F-", "FJ", "F7", "L-", "LJ", "L7"].includes(
      s
    );
    from.x === 90 && from.y === 69 && console.log(s, yes);
    return yes;
  }

  const s = from.y < to.y ? `${fat}${tat}` : `${tat}${fat}`;
  const yes = ["||", "|L", "|J", "F|", "FL", "FJ", "7|", "7L", "7J"].includes(
    s
  );
  from.x === 90 && from.y === 69 && console.log(s, yes);
  return yes;
}

function getDistances(grid: Array<Tile[]>) {
  const distances = grid.map((line) => line.map((x) => NaN));
  const start = getStart(grid);
  distances.setAt(start, 0);
  const seen = new Set<string>();
  const stack = getSurrondingPointsOrth(start, grid).filter(
    (x) => !seen.has(JSON.stringify(x)) && grid.ptAt(x) !== Tile.Ground
  );
  // console.log(start);
  while (stack.length) {
    const from = stack.shift()!;
    seen.add(JSON.stringify(from));
    const surrond = getSurrondingPointsOrth(from, grid).filter((x) =>
      canMoveTo(grid, from, x) && grid.ptAt(x) !== Tile.Ground
    );
    stack.push(...surrond.filter((x) => !seen.has(JSON.stringify(x))));
    // console.log(from, surrond, surrond.map((to) => distances.ptAt(to) + 1));
    distances.setAt(
      from,
      min([
        distances.ptAt(from),
        ...surrond.map((to) => distances.ptAt(to) + 1),
      ])
    );
  }

  return distances;
}

function run(data: string) {
  //   data = `7L-JLJ
  // L7S7F7
  // 7LJLJL`
  const parsedData = parse(data);

  const dist = getDistances(parsedData);
  const z = dist
    .map((x) => x.map((y) => (isNaN(y) ? "." : y)).join(" "))
    .join("\n");
  // console.log(z);

  return max(dist.flatMap((x) => x));
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
