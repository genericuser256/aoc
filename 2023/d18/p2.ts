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
  multPts,
  printGrid,
  repeat,
  strToDir,
  stringify,
  subPts,
  transpose,
  ty,
  valueAt,
} from "../utils/utils";
import { T_rlTurns } from "../utils/consts";

type Instruction = {
  t: T_rlTurns;
  dir: Pt2d;
  amount: number;
  code: string;
};

type Edge = {
  s: Pt2d;
  e: Pt2d;
  t: T_rlTurns;
  internal: Pt2d;
};

type Square = {
  s: Pt2d;
size: number;
}

function parseData(data: string) {
  return data
    .split("\n")
    .map((x) => x.match(/(\w) (\d+) \(#([\w\d]+)\)/)!)
    .map(([_, a, b, c]) => ({
      t: { "0": "R", "1": "D", "2": "L", "3": "U" }[c[c.length - 1]]!,
      dir: strToDir(
        { "0": "R", "1": "D", "2": "L", "3": "U" }[c[c.length - 1]]!
      ),
      amount: parseInt(c.substring(0, 5), 16),
      code: c,
    })) as any as Instruction[];
}

function getEdges(instructions: Instruction[]) {
  const edges: Edge[] = []
  const pts: Pt2d[] = [{ x: 0, y: 0 }];
  const turns: T_rlTurns[] = [];
  instructions.reduce(
    (prev, curr) => {
      const e = addPts(prev, multPts(curr.dir, curr.amount));
      edges.push({ s: prev, e, t: curr.t, internal: });
      pts.push(e);
      turns.push(curr.t);
      return e;
    },
    { x: 0, y: 0 } as Pt2d
  );

  return { edges, pts, turns };
}

const testPts: Pt2d[] = [
  { x: 0, y: 0 },
  { x: 2, y: 0 },
  { x: 2, y: 2 },
  { x: 4, y: 2 },
  { x: 4, y: -2 },
  { x: 0, y: -2 },
  { x: 0, y: -4 },
  { x: 8, y: -4 },
  { x: 8, y: -1 },
  { x: 6, y: -1 },
  { x: 6, y: 1 },
  { x: 8, y: 1 },
  { x: 8, y: 4 },
  { x: 0, y: 4 },
  { x: 0, y: 0 },
];

const testTurns: T_rlTurns[] = [];

// Solution is something along the lines of
// get edges (done)
// take edges and find smallest squares they contain (cry)
//    - use turns?
//    - scan from each direction and find smallest squares that way?
// add up areas of squares (easy)

function run(input: string) {
  const data = parseData(input);
  const { edges, turns, pts } = getEdges(data);
  // console.log(edges, turns);
  const squares = []
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
