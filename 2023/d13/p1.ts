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
  multAcc,
  repeat,
  str,
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

function findAxis(mirror: Mirror) {
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
  // console.log(indexMap, indexArr);
  return [
    indexArr[0]
      .map((right) => meetInTheMiddle(indexArr, 0, right))
      .find((x) => !!x),
    indexArr[indexArr.length - 1]
      .map((left) => meetInTheMiddle(indexArr, left, indexArr.length - 1))
      .find((x) => !!x),
  ];
}

function run(data: string) {
  const parsedData = parse(data);
  // return findAxis(parsedData[0].h);
  return sum(
    parsedData.map(({ v, h }) =>
      [findAxis(v).find(Boolean), findAxis(h).find(Boolean)! * 100].find(
        Boolean
      )
    )
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
