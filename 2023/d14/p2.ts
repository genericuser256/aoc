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
  stringify,
  transpose,
  ty,
  valueAt,
} from "../utils/utils";

type Board = ("O" | "#" | ".")[][];

const Dir = {
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  W: { x: -1, y: 0 },
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

function tiltN(board: Board, dir: Pt2d): Board {
  let newBoard = cloneDeep(board);
  let moved = false;
  do {
    // let m = [] as any[];
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
            // m.push(`${str({ x, y })}->${str(pt)}`);
          }
        }
      }
    }
    // console.log(m.join("\n"))
    moved = false;
    // m = [];
  } while (moved);

  return newBoard;
}

function tiltW(board: Board, dir: Pt2d): Board {
  let newBoard = cloneDeep(board);
  let moved = false;
  do {
    // let m = [] as any[];
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
            // m.push(`${str({ x, y })}->${str(pt)}`);
          }
        }
      }
    }
    // console.log(m.join("\n"))
    moved = false;
    // m = [];
  } while (moved);

  return newBoard;
}

function tiltS(board: Board, dir: Pt2d): Board {
  let newBoard = cloneDeep(board);
  let moved = false;
  do {
    // let m = [] as any[];
    for (let y = board.length - 1; y >= 0; y--) {
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
            // m.push(`${str({ x, y })}->${str(pt)}`);
          }
        }
      }
    }
    // console.log(m.join("\n"))
    moved = false;
    // m = [];
  } while (moved);

  return newBoard;
}

function tiltE(board: Board, dir: Pt2d): Board {
  let newBoard = cloneDeep(board);
  let moved = false;
  do {
    // let m = [] as any[];
    for (let y = 0; y < board.length; y++) {
      const line = board[y];
      for (let x = line.length - 1; x >= 0; x--) {
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
            // m.push(`${str({ x, y })}->${str(pt)}`);
          }
        }
      }
    }
    // console.log(m.join("\n"))
    moved = false;
    // m = [];
  } while (moved);

  return newBoard;
}

function getLoad(board: Board, pt: Pt2d): number {
  return board.length - pt.y;
}

function getBoardLoad(board: Board) {
  return sum(
    board.flatMap((line, y) =>
      line.map((c, x) => (c === "O" ? getLoad(board, { x, y }) : 0))
    )
  );
}

function run(data: string) {
  const parsedData = parse(data);
  const cycles = 1_000_000_000;
  const dirs: Array<[Pt2d, (board: Board, dir: Pt2d) => Board]> = [
    [Dir.N, tiltN],
    [Dir.W, tiltW],
    [Dir.S, tiltS],
    [Dir.E, tiltE],
  ];
  let board = parsedData;
  const mainCache = new Map<string, [Board, number, number]>();
  const innerCache = new Map<string, Board>();
  const stats = [0, 0, 0, 0];
  let lastBoard = printGrid(board);
  let i = 0;
  for (; i < cycles; i++) {
    const key = printGrid(board);
    const cached = mainCache.get(key);
    if (cached) {
      // console.log(i, cached[2]);
      stats[0]++;
      board = cached[0];
      mainCache.set(key, [board, cached[1] + 1, cached[2]]);
    } else {
      stats[1]++;
      for (let i2 = 0; i2 < 4; i2++) {
        const [dir, fn] = dirs[Number(i2 % 4)];
        const innerKey = `${printGrid(board)},${i2 % 4}`;
        const innerCached = innerCache.get(innerKey);
        if (innerCached) {
          stats[2]++;
          board = innerCached;
        } else {
          stats[3]++;
          board = fn(board, dir);
          innerCache.set(innerKey, board);
        }
        // console.log(printGrid(board));
        // console.log();
      }
      mainCache.set(key, [board, 1, i]);
    }

    // console.log(printGrid(board));
    // console.log();

    if (i % 1000 === 0 && i > 10) {
      console.log(
        `Done: ${(i / 10_000_000).toLocaleString(undefined, {
          useGrouping: true,
        })}%, h: ${stats}, l: ${sum(
          board.flatMap((line, y) =>
            line.map((c, x) => (c === "O" ? getLoad(board, { x, y }) : 0))
          )
        )}, c: ${lastBoard === printGrid(board)}`
      );
      break;
      console.log([...mainCache.values()].map((x) => x[1]).toSorted());
      lastBoard = printGrid(board);
    }
  }

  let cycleVals = [...mainCache.values()]
    .filter((x) => x[1] > 1)
    .toSorted(([x, y, z], [a, b, c]) => z - c);
  cycleVals = cycleVals.map(([a, b, c]) => [a, b, c - first(cycleVals)![2]]);
  cycleVals.peek(([b, n, i]) => {
    // console.log(printGrid(b))
    console.log(n, getBoardLoad(b), i);
  });

  // console.log(printGrid(parsedData));
  // console.log(printGrid(final));
  const whereInCycle = cycleVals.find(
    (x) => printGrid(x[0]) === printGrid(board)
  )!;
  const remaining = cycles - i - 1;
  console.log(
    whereInCycle[2],
    cycleVals.length,
    remaining,
    (remaining - whereInCycle[2]) % cycleVals.length
  );
  // (cycleVals.length - whereInCycle[2])

  return getBoardLoad(
    cycleVals.find(
      ([a, b, c]) => (remaining - whereInCycle[2] - 1) % cycleVals.length === c
    )![0]
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
