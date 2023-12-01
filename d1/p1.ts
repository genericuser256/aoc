import { sum } from "lodash";

function getNumber(line: string): number {
  const firstNum = /\d/.exec(line)!;
  const lastNum = /\d/.exec(line.split("").reverse().join(""))!;
  return parseInt(firstNum[0] + lastNum[0]);
}

function run(data: string) {
  console.log(sum(data.split("\n").map(getNumber)));
}

export default (day: number, data: string, example: string, input: string) => {
  run(input);
};
