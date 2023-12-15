import { sum } from "lodash";

const maxCounts: Array<[string, number]> = [
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

function isPossible(line: string): { id: number; possible: boolean } {
  const id = parseInt(/Game (\d+)/.exec(line)![1]);
  const rest = line.split(": ")[1];
  const pulls = rest.split(";");
  const possible = pulls.every((pull) => {
    return maxCounts.every(([c, num]) => {
      count(pull, c) > num &&
        console.log(id, pull, "--", c, num, count(pull, c));
      return count(pull, c) <= num;
    });
  });
  if (possible) {
    console.log(id, line);
  }
  return { id, possible };
}

function run(data: string) {
  return sum(
    data
      .split("\n")
      .map(isPossible)
      .filter((x) => {
        // console.log(x);
        return x.possible;
      })
      .map((x) => x.id)
  );
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
