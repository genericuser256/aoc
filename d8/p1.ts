import { min, sortBy, sum, uniq } from "lodash";
import { between, multAcc } from "../utils/utils";

function parse(data: string): {
  steps: Array<0 | 1>;
  graph: Record<string, [string, string]>;
} {
  const lines = data.split("\n");

  return {
    steps: lines[0].split("").map((x) => (x === "R" ? 1 : 0)),
    graph: lines.slice(2).reduce(
      (acc, curr) => {
        const [_, key, left, right] = curr.match(
          /(\w+)\s+=\s+\((\w+),\s+(\w+)\)/
        )!;
        acc[key] = [left, right];
        return acc;
      },
      {} as Record<string, [string, string]>
    ),
  };
}

function getLength(
  steps: Array<0 | 1>,
  graph: Record<string, [string, string]>
): number {
  let k = "AAA";
  let i = 0;
  let count = 0;
  while (k !== "ZZZ") {
    count++;
    k = graph[k][steps[i]];
    i = (i + 1) % steps.length;
  }

  return count;
}

function run(data: string) {
  const { steps, graph } = parse(data);
  return getLength(steps, graph)
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
