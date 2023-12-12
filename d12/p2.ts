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

function countArrangementsInt(
  line: string,
  groups: string[],
  damaged: number[]
): number {
  if (groups.length === 0 && damaged.length) {
    throw "bad";
  }

  if (damaged.length === 0) {
    return 0;
  }

  if (damaged.length === 1 && groups.length === 1) {
    return getFits(groups[0], damaged[0]).length;
  }

  let count = 0;
  groups.forEach((group, i) => {
    const fits = getFits(group, damaged[0]);
    fits.forEach((fitI) => {
      try {
        count += countArrangementsInt(
          line,
          [group.substring(fitI + damaged[0]), ...groups.slice(i + 1)].filter(
            Boolean
          ),
          damaged.slice(1)
        );
      } catch {
        // pass
      }
    });
  });
  return count;
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
  const re1 = res
    .reduce((acc, curr, i) => {
      if (i === 0) {
        return [`${curr}`, `\\.${curr}`, `\\?${curr}`];
        // return acc.map(x => `${x}${curr}`)
      }
      return [
        ...acc.map((x) => `${x}[^#]*\\.${curr}`),
        ...acc.map((x) => `${x}[^#]*\\?${curr}`),
      ];
    }, [] as string[])
    // .peek((x) => console.log(x))
    .map((x) => new RegExp(x, "g"));

  //new RegExp(res.map((x, i) => i === 0 ? x : `[^#]${x}`).join(".*"), "g");
  const re2 = new RegExp(
    res.map((x, i) => (i === 0 ? x : `\\.${x}`)).join(".*"),
    "g"
  );
  // console.log(re1.source)
  // // const splitLine = line.split("");
  // // const possibleIndices = splitLine
  // //   .map((c, i) => (c !== "." ? i : undefined))
  // //   .filter((x) => x !== undefined);
  // return [...line.matchAll(re1)].flatMap(x => x);
  // re1.map((x) => console.log(x, [...line.matchAll(x)]));
  return re1.map((x) => x.test(line)).filter(Boolean).length;
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
