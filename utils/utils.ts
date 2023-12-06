export function strReverse(str: any): string {
  return `${str}`.split("").reverse().join("");
}
export function multAcc(arr: number[]): number {
  return arr.reduce((prev, curr) => prev * curr, 1);
}

export function isNum(val: any): boolean {
  return !isNaN(parseFloat(val));
}

export function valueAt<T>(arr: T[][], loc: Pt2d): T | undefined {
  return arr[loc.y] ? arr[loc.y][loc.x] : undefined;
}

export function generateRange(start: number, end: number): number[] {
  const ret: number[] = [];
  for (let i = start; i <= end; i++) {
    ret.push(i);
  }
  return ret;
}

export function getSurrondingPoints(initialPt: Pt2d = { x: 0, y: 0 }): Pt2d[] {
  const ret: Pt2d[] = [];
  for (let y = -1; y < 2; y++) {
    for (let x = -1; x < 2; x++) {
      ret.push({ x: x + initialPt.x, y: y + initialPt.y });
    }
  }
  return ret;
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

export interface Range {
  start: number;
  end: number;
}

export interface Pt2d {
  x: number;
  y: number;
}
