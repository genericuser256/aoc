import { sum } from "lodash";
import { multAcc } from "../utils/utils";

interface Card {
  id: number;
  winners: number[];
  have: number[];
}

function parse(data: string): Card[] {
  const lines = data.split("\n");
  return lines.map((line) => {
    const result = /Card\s*(\d+):([\s\d]+)\|([\s\d]+)/.exec(line)!;
    const id = parseInt(result[1]);
    const winners = result[2]
      .trim()
      .split(/\s+/)
      .map((x) => parseInt(x));
    const have = result[3]
      .trim()
      .split(/\s+/)
      .map((x) => parseInt(x));
    return {
      id,
      winners,
      have,
    };
  });
}

function scoreCard(card: Card): number {
  const haveWinners = card.have.filter((i) => card.winners.includes(i));
  // console.log(card, haveWinners, Math.pow(2, haveWinners.length - 1))
  return Math.floor(Math.pow(2, haveWinners.length - 1));
}

function run(data: string) {
  return sum(parse(data).map(scoreCard));
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
