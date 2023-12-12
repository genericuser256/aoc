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
      line: lineStr,
      damaged: damagedStr.split(",").map((x) => parseInt(x)),
    };
  });
}

function getRegex(size: number): string {
  return generateRange(1, size)
    .map((x) => "[?#]")
    .join("");
}

function permute(line: string): string[] {
  return line.split("").reduce((acc, curr, i) => {
    if (i === 0) {
      if (curr === "?") {
        return [".", "#"];
      }
      return [curr];
    }
    if (curr === "?") {
      return [...acc.map((x) => `${x}.`), ...acc.map((x) => `${x}#`)];
    }
    return acc.map((x) => `${x}${curr}`);
  }, [] as string[]);
}

function countArrangements(line: string, damaged: number[]) {
  const res = damaged.map((x) => getRegex(x));
  const re = new RegExp(`^[^#]*${res.join("[^#]\\.*")}[^#]*$`, "g");
  // console.log(
  //   line,
  //   re.source,
  //   "\n",
  //   permute(line).join("\n"),
  //   "\n",
  //   new Set(
  //     permute(line)
  //       .flatMap((x) => [...x.matchAll(re)])
  //       .flatMap((x) => x)
  //   )
  // );
  return [
    ...new Set(
      permute(line)
        .flatMap((x) => [...x.matchAll(re)])
        .flatMap((x) => x)
    ),
  ].length;
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
