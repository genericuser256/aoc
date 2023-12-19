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
  stringify,
  transpose,
  ty,
  valueAt,
} from "../utils/utils";

function parseData(data: string) {
  return data.split(",");
}

function hash(str: string) {
  return str.split("").reduce((acc, curr) => {
    const code = curr.charCodeAt(0);
    acc += code;
    acc *= 17;
    return acc % 256;
  }, 0);
}

function run(data: string) {
  const parsedData = parseData(data);
  return sum(parsedData.map((str) => hash(str)));
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
