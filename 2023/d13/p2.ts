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
  between,
  generateRange,
  getSurrondingPoints,
  getSurrondingPointsOrth,
  isNum,
  multAcc,
  repeat,
  stringify,
  transpose,
  ty,
  valueAt,
} from "../utils/utils";

type Mirror = string[];

function parse(data: string) {
  const lines = data.split("\n");
  const acc: Array<string[]> = [[]];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.length) {
      acc[acc.length - 1].push(line);
    } else {
      acc.push([]);
    }
  }
  return acc.map((mirror) => {
    return {
      h: mirror,
      v: transpose(cloneDeep(mirror.map((x) => x.split("")))).map((x) =>
        x.join("")
      ),
    };
  });
}

function meetInTheMiddle(
  indexArr: number[][],
  left: number,
  right: number
): number {
  while (true) {
    if (!indexArr[left].includes(right) && !indexArr[right].includes(left)) {
      return 0;
    }

    if (left >= right) {
      break;
    }

    left++;
    right--;
  }

  return left;
}

function findOgAxis(mirror: Mirror, ogAxis: number | undefined = undefined) {
  const map = new Map<string, number[]>();
  mirror.forEach((x, i) => {
    if (!map.has(x)) {
      map.set(x, []);
    }
    map.set(x, [...map.get(x)!, i]);
  });
  const indexMap = new Map<number, number[]>();
  [...map.values()].forEach((pairs) => {
    pairs.forEach((i) => {
      if (indexMap.has(i)) {
        console.log("uh oh", i, indexMap);
        throw "bad";
      }
      indexMap.set(
        i,
        pairs.filter((x) => x !== i)
      );
    });
  });
  const indexArr = repeat(mirror.length, [] as number[]);
  [...indexMap.entries()].forEach(
    ([k, v]) => (indexArr[k] = v.toSorted().toReversed())
  );
  // console.log(indexMap);
  // console.log(indexArr);
  const x = max([
    indexArr[0]
      .map((right) => meetInTheMiddle(indexArr, 0, right))
      .find((x) => !!x),
    indexArr[indexArr.length - 1]
      .map((left) => meetInTheMiddle(indexArr, left, indexArr.length - 1))
      .find((x) => !!x),
  ]);
  // return x;
  return [
    indexArr[0]
      .map((right) => meetInTheMiddle(indexArr, 0, right))
      .find((x) => !!x && x !== ogAxis),
    indexArr[indexArr.length - 1]
      .map((left) => meetInTheMiddle(indexArr, left, indexArr.length - 1))
      .find((x) => !!x && x !== ogAxis),
  ].find(Boolean);
}

function findDifferentAxis(mirror: Mirror, ogAxis: number | undefined) {
  // console.log(mirror.join("\n"), ogAxis);
  for (let y = 0; y < mirror.length; y++) {
    const line = mirror[y];
    const splitLine = line.split("");
    for (let x = 0; x < line.length; x++) {
      // console.log();
      const c = line[x];
      const nc = c === "." ? "#" : ".";
      // if (y === 11) {
      //   console.log(x, line);
      //   console.log(splitLine.toSpliced(x, 1, nc).join(""));
      //   console.log();
      // }
      const newMirror = mirror.toSpliced(
        y,
        1,
        splitLine.toSpliced(x, 1, nc).join("")
      );
      // y === 11 &&
      //   x === 10 &&
      //   console.log(newMirror.join("\n"), findOgAxis(newMirror));
      const diffAxis = findOgAxis(newMirror, ogAxis);
      if (diffAxis !== undefined && ogAxis !== diffAxis) {
        // throw "hi";
        return diffAxis;
      }
    }
  }
}

function run(data: string) {
  const parsedData = parse(data);

  //   console.log(findOgAxis(`.#.#...#.#.###.
  // .###.#..#..##.#
  // .###.#..#...#.#
  // .###.#..#...#.#
  // .###.#..#..##.#
  // ...#...#.#.###.
  // .#....##.#....#
  // ##.#..#..#.#..#
  // #.###.########.
  // ##...#.#..##.##
  // #.##.#####.#.#.
  // .#.####.###..##
  // ..##.##.#.##..#
  // #.##.#....###.#
  // #.##.#....###.#
  // ..##.##.#.##..#
  // .#.####.###..##`.split("\n")))

  // const num = 2;
  // console.log(findOgAxis(parsedData[num].h));
  // console.log(findOgAxis(parsedData[num].v));
  // // console.log(parsedData[num].v.join("\n"))

  // console.log(
  //   findDifferentAxis(parsedData[num].h, findOgAxis(parsedData[num].h))
  // );
  // console.log(
  //   findDifferentAxis(parsedData[num].v, findOgAxis(parsedData[num].v))
  // );
  // return;
  return sum(
    parsedData.map(({ v, h }, i) => {
      const ogAxisOpts = [findOgAxis(v), findOgAxis(h)];
      const diffAxisOpts = [
        findDifferentAxis(v, ogAxisOpts[0]),
        findDifferentAxis(h, ogAxisOpts[1])! * 100,
      ];
      const diffAxis = diffAxisOpts.find(Boolean);
      if (!isNum(diffAxis)) {
        const ret = [ogAxisOpts[0], ogAxisOpts[1]! * 100].find(Boolean);
        console.log(`${i} is bad`, ret);
        return ret;
      }
      return diffAxis;
    })
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
