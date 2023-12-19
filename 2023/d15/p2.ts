import {
  cloneDeep,
  find,
  findIndex,
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
  return data.split(",").map((str, i) => {
    const res = str.match(/^(\w+)([-=])(\d*)$/);
    if (!res) {
      throw `${str}, ${i}`;
    }
    return {
      label: res[1],
      op: res[2],
      focal: res[3] ? parseInt(res[3]) : -1,
      str,
    };
  });
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
  const boxes: Array<{ label: string; focal: number }[]> = repeat(256, []);
  parsedData.forEach(({ label, op, focal, str }, i) => {
    const h = hash(label);
    const box = boxes[h];
    if (!box) {
      console.log(label, op, focal, i, boxes);
      throw `bad`;
    }
    if (op === "=") {
      const index = findIndex(box, { label });
      if (index === -1) {
        box.push({ label, focal });
      } else {
        box[index].focal = focal;
      }
    } else {
      const index = findIndex(box, { label });
      if (index !== -1) {
        box.splice(index, 1);
      }
    }

    // console.log("After:", str);
    // boxes.forEach((box, i) => {
    //   if (box.length) {
    //     console.log(
    //       "Box",
    //       i,
    //       box.map(({ label, focal }) => `[${label} ${focal}]`).join(" ")
    //     );
    //   }
    // });
    // console.log();
  });
  return sum(
    boxes.map((box, i) =>
      sum(box.map(({ label, focal }, slot) => (i + 1) * (slot + 1) * focal))
    )
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
