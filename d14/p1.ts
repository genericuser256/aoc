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
  printGrid,
  repeat,
  str,
  transpose,
  ty,
  valueAt,
} from "../utils/utils";

type Board = ("O" | "#" | ".")[][];

const Dir = {
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: -1, y: 0 },
  W: { x: 1, y: 0 },
};

function parse(data: string) {
  return data.split("\n").map((x) => x.split("")) as any as Board;
}

function canMoveTo(board: Board, pt: Pt2d) {
  // console.log(str(pt), isIn(board, pt), board.ptAt(pt))
  if (!isIn(board, pt)) {
    return false;
  }

  return board.ptAt(pt) === ".";
}

function tilt(board: Board, dir: Pt2d): Board {
  let newBoard = cloneDeep(board);
  let moved = false;
  do {
    let m = [] as any[];
    for (let y = 0; y < board.length; y++) {
      const line = board[y];
      for (let x = 0; x < line.length; x++) {
        const c = line[x];
        if (c === "O") {
          let pt = { x, y };
          if (canMoveTo(newBoard, addPts(pt, dir))) {
            while (canMoveTo(newBoard, addPts(pt, dir))) {
              newBoard.setAt(pt, ".");
              moved = true;
              pt = addPts(pt, dir);
              newBoard.setAt(pt, "O");
            }
            // console.log(x, y);
            // console.log(printGrid(newBoard));
            m.push(`${str({ x, y })}->${str(pt)}`);
          }
        }
      }
    }
    // console.log(m.join("\n"))
    moved = false;
    m = [];
  } while (moved);

  return newBoard;
}

function getLoad(board: Board, pt: Pt2d): number {
  return board.length - pt.y;
}

function run(data: string) {
  const parsedData = parse(data);
  // console.log(printGrid(parsedData));
  const final = tilt(parsedData, Dir.N);
  // console.log(printGrid(final));

  return sum(
    final.flatMap((line, y) =>
      line.map((c, x) => (c === "O" ? getLoad(final, { x, y }) : 0))
    )
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
