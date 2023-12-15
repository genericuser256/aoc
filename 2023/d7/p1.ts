import { min, sortBy, sum, uniq } from "lodash";
import { between, multAcc } from "../utils/utils";

type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

type Hand = Card[];

function parse(data: string): Array<{ hand: Hand; bid: number }> {
  const lines = data.split("\n").map((x) => x.split(" "));

  return lines.map((line) => {
    return {
      hand: line[0].split("") as any as Hand,
      bid: parseInt(line[1]),
    };
  });
}

function count(hand: Hand, card: Card): number {
  return hand.filter((x) => x === card).length;
}

function countCards(hand: Hand): Array<[Card, number]> {
  return sortBy(
    uniq(hand).map((x) => [x, count(hand, x)]),
    [1]
  ).reverse() as Array<[Card, number]>;
}

// Five of a kind, where all five cards have the same label: AAAAA
function isFiveOfAKind(hand: Hand): boolean {
  const set = new Set(hand);
  return set.size === 1;
}
// Four of a kind, where four cards have the same label and one card has a different label: AA8AA
function isFourOfAKind(hand: Hand): boolean {
  const set = new Set(hand);
  const counts = countCards(hand);
  return set.size === 2 && counts[0][1] === 4;
}
// Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
function isFullHouse(hand: Hand): boolean {
  const set = new Set(hand);
  const counts = countCards(hand);
  return set.size === 2 && counts[0][1] === 3;
}
// Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
function isThreeOfAKind(hand: Hand): boolean {
  const set = new Set(hand);
  const counts = countCards(hand);
  return set.size === 3 && counts[0][1] === 3;
}
// Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
function isTwoPair(hand: Hand): boolean {
  const set = new Set(hand);
  const counts = countCards(hand);
  return set.size === 3 && counts[0][1] === 2;
}
// One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
function isOnePair(hand: Hand): boolean {
  const set = new Set(hand);
  const counts = countCards(hand);
  return set.size === 4 && counts[0][1] === 2;
}
// High card, where all cards' labels are distinct: 23456
function isHighCard(hand: Hand): boolean {
  const set = new Set(hand);
  return set.size === 5;
}

function score(hand: Hand) {
  if (isFiveOfAKind(hand)) {
    return 7;
  }
  if (isFourOfAKind(hand)) {
    return 6;
  }
  if (isFullHouse(hand)) {
    return 5;
  }
  if (isThreeOfAKind(hand)) {
    return 4;
  }
  if (isTwoPair(hand)) {
    return 3;
  }
  if (isOnePair(hand)) {
    return 2;
  }
  if (isHighCard(hand)) {
    return 1;
  }
  throw `${hand.join(",")} is bad`;
}

function compareCards(a: Card, b: Card): number {
  const scoreMap = {
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
    "8": 7,
    "9": 8,
    T: 9,
    J: 10,
    Q: 11,
    K: 12,
    A: 13,
  };
  const scoreA = scoreMap[a];
  const scoreB = scoreMap[b];
  return scoreA - scoreB;
}

function compareHands(a: Hand, b: Hand): number {
  const scoreA = score(a);
  const scoreB = score(b);
  if (scoreA === scoreB) {
    for (let i = 0; i < 5; i++) {
      const diff = compareCards(a[i], b[i]);
      if (diff === 0) {
        continue;
      }

      return diff;
    }

    throw `${a.join(",")} is the same as ${b.join(",")}`;
  }
  return scoreA - scoreB;
}

function run(data: string) {
  const parsedData = parse(data);
  const sortedHands = parsedData.toSorted((a, b) =>
    compareHands(a.hand, b.hand)
  );
  // const sortedBids = parsedData.bids.toSorted();
  // console.log(parsedData.hands.map(x => x.join("")), parsedData.scores);
  // console.log(sortedHands.map(x => x.join("")), sortedScores);

  // console.log(parsedData.map(score));
  // console.log(sortedHands);
  return sum(sortedHands.map(({ hand, bid }, i) => (i + 1) * bid));
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
