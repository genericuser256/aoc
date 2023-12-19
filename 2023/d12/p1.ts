import { first, last, max, min, sortBy, sum, uniq } from "lodash";
import {
  Pt2d,
  between,
  generateRange,
  getSurrondingPoints,
  getSurrondingPointsOrth,
  multAcc,
  repeat,
  stringify,
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

function findFits(line: string, size: number): number[] {
  const n = line.length;
  const ret: number[] = [];
  for (let i = 0; i < n; i++) {
    const substr = line.substring(i, i + size);
    const before = i === 0 ? "" : "[^#]";
    const after = i === n - size - 1 ? "" : "[^#]";
    const re = new RegExp(getRegex(size));
    // substr === "###" && console.log(re.source, re.test(substr), i, size, n)
    if (re.test(substr)) {
      if (
        (i === 0 || (i !== 0 && line[i - 1] !== "#")) &&
        (i + size === n || (i + size <= n - 1 && line[i + size] !== "#"))
      ) {
        ret.push(i);
      }
    }
  }
  return ret;
}

function countArrangements2(line: string, damaged: number[]): string[] {
  const placing = damaged[0];
  const fits = findFits(line, placing);
  // console.log(line, placing, fits);
  if (damaged.length === 1) {
    return fits
      .map((i) => {
        const x = line.replaceAll("?", ".").split("");
        x.splice(i, placing, ...repeat(placing, "#"));
        return x.join("");
      })
      .filter((x) => [...x.matchAll(/#+/g)].length === 1);
  }

  return fits.flatMap((fit) =>
    countArrangements2(line.substring(fit + placing + 1), damaged.slice(1)).map(
      (x) =>
        line.replaceAll("?", ".").substring(0, fit) +
        repeat(placing, "#").join("") +
        "." +
        x
    )
  );
}

function countArrangements(line: string, damaged: number[]): number {
  const placing = damaged[0];
  const fits = findFits(line, placing);
  console.log(line, placing, fits);
  if (damaged.length === 1) {
    return fits.length;
  }

  return sum(
    fits.map((fit) =>
      countArrangements(line.substring(fit + placing + 1), damaged.slice(1))
    )
  );
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

function countArrangements3(line: string, damaged: number[]) {
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
  ];
}

function run(data: string) {
  const parsedData = parse(data);
  const t = "?.#.??.???";
  const s = [1, 1, 2];
  const res = s.map((x) => getRegex(x));
  const re = new RegExp(`^[^#]*${res.join("[^#]\\.*")}[^#]*$`, "");
  console.log(re.source)
  console.log(countArrangements2(t, s).filter(y => !re.test(y)).join("\n"));
  console.log()
  console.log(countArrangements3(t, s).join("\n"));
  // [...new Set(permute(t))].map(x =>/^\.*#{3}\.+#{3}\.+#\.+#\.+#\.+$/.test(x) && console.log(x, /#{3}\.+#{3}\.+#\.+#\.+#/.test(x)))
  return sum(
    parsedData.map(({ line, damaged }) => {
      const res = damaged.map((x) => getRegex(x));
      const re = new RegExp(`^[^#]*${res.join("[^#]\\.*")}[^#]*$`, "");

      const x = countArrangements2(line, damaged).filter(y => re.test(y));
      // const x2 = countArrangements3(line, damaged);
      // console.log(re.source)
      // x.length !== x2.length &&
      //   console.log(line, damaged.join(","), "total", x.length, x2.length, "\n");
      return x.length;
    })
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
