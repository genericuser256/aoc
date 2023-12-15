import { min, sum } from "lodash";
import { between, multAcc } from "../utils/utils";

interface Race {
  id: number;
  time: bigint;
  distance: bigint;
}

function parse(data: string): Race {
  const [t, d] = data.split("\n").map((x) => {
    return BigInt(x.split(":")[1].split(/\s+/).join(""));
  });

  return {
    id: 0,
    time: t,
    distance: d,
  };
}

function score(race: Race) {
  let t = BigInt(0);
  while (t * (race.time - t) <= race.distance && t < race.time) {
    t += BigInt(1);
  }

  let count = 0;
  console.log(t, t * (race.time - t), race.distance, race.time);
  let last = t * (race.time - t);
  while (t * (race.time - t) > race.distance && t < race.time) {
    // console.log(t, t * (race.time - t));
    t += BigInt(1);
    count += 1;
    const x = t * (race.time - t)
    if (x === last) {
      count += count;
      break;
    }
    if (x < last) {
      count += count - 1;
      break;
    }
    last = x;
  }

  // console.log(race.id, t, count, t*t, race.distance)

  return count;
}

function run(data: string) {
  const parsedData = parse(data);
  // console.log(parsedData.map(score));
  return score(parsedData);
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
