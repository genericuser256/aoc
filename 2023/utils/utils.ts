import { cloneDeep, zip } from "lodash";

export function strReverse(str: any): string {
  return `${str}`.split("").reverse().join("");
}
export function multAcc(arr: number[]): number {
  return arr.reduce((prev, curr) => prev * curr, 1);
}

export function isNum(val: any): boolean {
  return !isNaN(parseFloat(val));
}

type Falsy = false | 0 | "" | null | undefined;
export function ty<T>(val: T | Falsy): val is T {
  return Boolean(val);
}

export function valueAt<T>(arr: T[][], loc: Pt2d): T | undefined {
  return arr[loc.y] ? arr[loc.y][loc.x] : undefined;
}

export function repeat<T>(size: number, value: T): T[] {
  return generateRange(1, size).map((x) => cloneDeep(value));
}

export function transpose<T>(matrix: T[][]): T[][] {
  return zip(...matrix) as any as T[][];
}

export function generateRange(start: number, end: number): number[] {
  const ret: number[] = [];
  for (let i = start; i <= end; i++) {
    ret.push(i);
  }
  return ret;
}

export function getDim(grid: unknown[][]): Pt2d {
  return {
    x: grid[0].length - 1,
    y: grid.length - 1,
  };
}

export function printGrid(
  grid: any[][],
  opts: { log?: boolean; space?: boolean } = {}
): string {
  opts = { ...{ log: true, space: true }, ...opts };
  let str: string = grid
    .map((row) => row.join(opts.space ? " " : ""))
    .join("\n");
  if (typeof grid[0][0] === "number") {
    const tGrid = grid as number[][];
    const maxDigits = Math.max(
      ...tGrid.flatMap((row) =>
        row.map((x) => (x === Infinity ? 1 : `${x}`.length))
      )
    );
    const formatter = Intl.NumberFormat(undefined, {
      minimumIntegerDigits: maxDigits,
    });
    str = tGrid
      .map((row) =>
        row
          .map((x) =>
            x === Infinity
              ? repeat(maxDigits, "-").join("")
              : formatter.format(x)
          )
          .join(opts.space ? " " : "")
      )
      .join("\n");
  }

  if (opts.log) {
    console.log();
    console.log(str);
  }

  return str;
}

export function getSurrondingPoints(
  initialPt: Pt2d = { x: 0, y: 0 },
  grid: unknown[][] | undefined = undefined
): Pt2d[] {
  const ret: Pt2d[] = [];
  for (let y = -1; y < 2; y++) {
    for (let x = -1; x < 2; x++) {
      if (x === 0 && y === 0) {
        continue;
      }
      ret.push({ x: x + initialPt.x, y: y + initialPt.y });
    }
  }
  return grid ? ret.filter((p) => grid.ptAt(p)) : ret;
}

export function getSurrondingPointsOrth(
  initialPt: Pt2d = { x: 0, y: 0 },
  grid: unknown[][] | undefined = undefined
): Pt2d[] {
  const ret = [
    { x: initialPt.x - 1, y: initialPt.y },
    { x: initialPt.x + 1, y: initialPt.y },
    { x: initialPt.x, y: initialPt.y - 1 },
    { x: initialPt.x, y: initialPt.y + 1 },
  ];
  return grid ? ret.filter((p) => grid.ptAt(p)) : ret;
}

export function between(
  i: number,
  a: number,
  b: number,
  inclusive = true
): boolean {
  const a2 = Math.min(a, b);
  const b2 = Math.max(a, b);
  if (inclusive) {
    return i >= a2 && i <= b2;
  } else {
    return i > a2 && i < b2;
  }
}

export function gcd(arr: bigint[]) {
  if (arr.length === 2) {
    const [a, b] = arr;
    if (a === 0n) {
      return b;
    }
    return gcd([b % a, a]);
  }

  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = gcd([arr[i], result]);
    if (result === 1n) {
      return result;
    }
  }
  return result;
}

export function lcm(arr: number[]): bigint {
  let result = BigInt(arr[0]);

  for (let i = 1; i < arr.length; i++) {
    result = (BigInt(arr[i]) * result) / gcd([BigInt(arr[i]), result]);
  }
  return result;
}

export function isIn(grid: unknown[][], pt: Pt2d): boolean {
  return pt.y >= 0 && pt.y < grid.length && pt.x >= 0 && pt.x < grid[0].length;
}

export function addPts(a: Pt2d, b: Pt2d): Pt2d {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function subPts(a: Pt2d, b: Pt2d): Pt2d {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function multPts(a: Pt2d, b: Pt2d | number): Pt2d {
  if (typeof b === "number") {
    return {
      x: a.x * b,
      y: a.y * b,
    };
  }
  return {
    x: a.x * b.x,
    y: a.y * b.y,
  };
}

export function mannhattan(a: Pt2d, b: Pt2d): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export interface Range {
  start: number;
  end: number;
}

export interface Pt2d {
  x: number;
  y: number;
}

export function stringify(x: Pt2d): string {
  return `${x.x},${x.y}`;
}

export function dirToStr(dir: Pt2d): string {
  if (dir.x > 0) {
    return ">";
  }
  if (dir.x < 0) {
    return "<";
  }
  if (dir.y > 0) {
    return "U";
  }
  return "^";
}

export function strToDir(str: string): Pt2d {
  if ([">", "R", "E"].includes(str)) {
    return { x: 1, y: 0 };
  }
  if (["<", "L", "W"].includes(str)) {
    return { x: -1, y: 0 };
  }
  if (["V", "D", "S"].includes(str)) {
    return { x: 0, y: 1 };
  }
  if (["^", "U", "N"].includes(str)) {
    return { x: 0, y: -1 };
  }
  throw `${str} dunno`;
}
