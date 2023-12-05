import { sum } from "lodash";
import {
  Pt2d,
  getSurrondingPoints,
  isNum,
  multAcc,
  valueAt,
} from "../utils/utils";

function findGears(lines: Array<string[]>): Pt2d[] {
  const ret: Pt2d[] = [];
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "*") {
        ret.push({ x, y });
      }
    }
  }
  return ret;
}

function getNumber(lines: Array<string[]>, loc: Pt2d): number {
  let ret = 0;
  const pt = { ...loc };
  while (isNum(valueAt(lines, pt))) {
    // console.log(valueAt(lines, pt));
    pt.x -= 1;
  }
  pt.x += 1;

  while (isNum(valueAt(lines, pt))) {
    // console.log(ret, parseInt(valueAt(lines, pt) || ""));
    ret *= 10;
    ret += parseInt(valueAt(lines, pt) || "");
    pt.x += 1;
  }
  return ret;
}

function getAttachedNums(lines: Array<string[]>, loc: Pt2d): number[] {
  // console.log(
  //   getSurrondingPoints(loc)
  //     .filter((x) => isNum(valueAt(lines, x)))
  //     .map((x) => getNumber(lines, loc))
  // );
  return [
    ...new Set(
      getSurrondingPoints(loc)
        .filter((x) => isNum(valueAt(lines, x)))
        .map((x) => getNumber(lines, x))
    ),
  ];
}

function run(data: string) {
  const lines = data.split("\n").map((line) => line.split(""));
  const gearLocations = findGears(lines);
  const scores = gearLocations
    .map((loc) => {
      // console.log(loc, getAttachedNums(lines, loc));
      return getAttachedNums(lines, loc);
    })
    .filter((attached) => attached.length === 2)
    .map(([v1, v2]) => v1 * v2);
  return sum(scores);
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
