import { sum } from "lodash";

const maxCounts: Array<["red" | "green" | "blue", number]> = [
  ["red", 12],
  ["green", 13],
  ["blue", 14],
];

function count(pull: string, colour: string): number {
  const re = new RegExp(`(\\d+) ${colour}`);

  const result = re.exec(pull);
  if (!result) {
    return Number.NEGATIVE_INFINITY;
  }

  return parseInt(result[1]);
}

function getMinForPulls(line: string): { id: number; power: number } {
  const id = parseInt(/Game (\d+)/.exec(line)![1]);
  const rest = line.split(": ")[1];
  const pulls = rest.split(";");
  const maxes = {
    red: 0,
    green: 0,
    blue: 0,
  };
  pulls.forEach((pull) => {
    maxCounts.forEach(([c, num]) => {
      maxes[c] = Math.max(count(pull, c), maxes[c]);
      count(pull, c) <= num;
    });
  });
  return { id, power: Object.values(maxes).reduce((prev, curr) => prev * curr, 1) };
}

function run(data: string) {
  console.log(
    sum(
      data
        .split("\n")
        .map(getMinForPulls)
        .map((x) => x.power)
    )
  );
}

export default (day: number, data: string, example: string, input: string) => {
  run(data);
};
