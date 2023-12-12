import { first, last, max, min, sortBy, sum, uniq } from "lodash";
import {
  Pt2d,
  between,
  generateRange,
  getSurrondingPoints,
  getSurrondingPointsOrth,
  multAcc,
  str,
  ty,
  valueAt,
} from "../utils/utils";

enum Tile {
  Good = ".",
  Bad = "#",
  Unknown = "?",
}

function parse(data: string): Array<{ line: string; damaged: number[] }> {
  return data.split("\n").map((l) => {
    const [lineStr, damagedStr] = l.split(" ");
    return {
      line: generateRange(0, 4)
        .map((x) => lineStr)
        .join("?"),
      damaged: damagedStr.split(",").map((x) => parseInt(x)),
    };
  });
}

function getRegex(size: number): string {
  return generateRange(1, size)
    .map((x) => "[?#]")
    .join("");
}

function getFits(group: string, size: number): number[] {
  const splitGroup = group.split("");
  const n = group.length;
  const ret: number[] = [];
  splitGroup.forEach((c, i) => {
    if (n - i < size) {
      return;
    }

    if (
      (i === 0 || splitGroup[i - 1] === "?") &&
      (i + size === n || splitGroup[i + size] === "?")
    ) {
      ret.push(i);
    }
  });
  return ret;
}

function findFits(line: string, size: number): number[] {
  const splitLine = line.split("");
  const n = line.length;
  const ret: number[] = [];
  splitLine.forEach((c, i) => {
    if (n - i < size) {
      return;
    }

    if (
      (i === 0 || splitLine[i - 1] === "?") &&
      (i + size === n || splitLine[i + size] === "?")
    ) {
      ret.push(i);
    }
  });
  return ret;
}

function countArrangements(line: string, damaged: number[]): number {
  const placing = damaged[0];
  const fits = findFits(line, placing);
  if (damaged.length === 1) {
    return fits.length;
  }

  return sum(
    fits.map((fit) =>
      countArrangements(line.substring(fit + 1), damaged.slice(1))
    )
  );
}

function run(data: string) {
  const parsedData = parse(data);
  return sum(
    parsedData.map(({ line, damaged }) => countArrangements(line, damaged))
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
