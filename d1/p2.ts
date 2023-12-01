import { sum, indexOf, first, last, reverse } from "lodash";
import { numStrs } from "../utils/consts";
import { strReverse } from "../utils/utils";

function toNumber(str: any): number | null{
  if (!str) {
    return null;
  }
  if (isNaN(parseInt(str))) {
    return indexOf(numStrs, str) + 1
  }
  return parseInt(str)
}

function getNumber(line: string): number {
  const re = new RegExp(`(${numStrs.join("|")}|\\d)`, "g")
  const re2 = new RegExp(`(${numStrs.map(x => strReverse(x)).join("|")}|\\d)`, "g")
  const matches = line.match(re);
  const matches2 = strReverse(line).match(re2);
  const firstNum = toNumber(first(matches))
  const lastNum = toNumber(strReverse(first(matches2))) || firstNum
  // console.log(first(matches), strReverse(first(matches2)), matches)
  return parseInt(`${firstNum}` + `${lastNum}`);
}

function run(data: string) {
  // console.log(data.split("\n").map(x => `${x}   ${getNumber(x)}`).join("\n"))
  console.log(sum(data.split("\n").map(getNumber)));
}

export default (day: number, data: string, example: string, input: string) => {
  run(data);
};
