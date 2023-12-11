import { first, last, min, sortBy, sum, uniq } from "lodash";
import { between, multAcc } from "../utils/utils";

function parse(data: string): Array<number[]> {
  return data.split("\n").map((x) => x.split(" ").map((x) => parseInt(x)));
}

function done(line: number[]) {
  return line.every((x) => x === 0);
}

function generateSequence(line: number[]): Array<number[]> {
  let ret = [line];
  let curr = [...line];
  while (!done(curr)) {
    const newL: number[] = [];
    for (let i = 1; i < curr.length; i++) {
      newL.push(curr[i] - curr[i - 1]);
    }
    ret.push(newL);
    curr = newL;
  }

  return ret;
}

function extrapolateLine(a: number, b: number): number {
  return a + b;
}

function extrapolate(sequence: Array<number[]>): number[] {
  const ret: number[] = [0];
  for (let i = sequence.length - 2; i >= 0; i--) {
    const line = sequence[i];
    ret.push(extrapolateLine(last(line)!, last(ret)!));
  }
  return ret.toReversed();
}

function run(data: string) {
  const parsedData = parse(data);
  return sum(
    parsedData
      .map(generateSequence)
      .map((x) => extrapolate(x))
      .map((x) => first(x)!)
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
