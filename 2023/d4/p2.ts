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
  return card.have.filter((i) => card.winners.includes(i)).length;
}

function run(data: string) {
  let total = 0;
  const cards = parse(data).map((card) => ({ card, count: 1 }));
  cards.forEach(({ card, count }, i) => {
    total += count;
    const score = scoreCard(card);
    // console.log(card.id, total, count, score);
    for (let i2 = 1; i2 <= score; i2++) {
      if (!cards[i + i2]) {
        break;
      }
      cards[i + i2].count += count;
    }
  });
  return total;
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
