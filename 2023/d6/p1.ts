import { min, sum } from "lodash";
import { between, multAcc } from "../utils/utils";

interface Race {
  id: number;
  time: number;
  distance: number;
}

function parse(data: string): Race[] {
  const [t, d] = data
    .split("\n")
    .map((x) => x.match(/\d+/g)?.map((y) => parseInt(y)));

  return t!.map((x, i) => {
    return {
      id: i,
      time: x,
      distance: d![i],
    };
  });
}

function score(race: Race) {
  let t = 0;
  while (t * (race.time - t) <= race.distance && t < race.time) {
    t += 1;
  }

  let count = 0;
  // console.log(t, t * (race.time - t), race.distance, race.time);
  while (t * (race.time - t) > race.distance && t < race.time) {
    // console.log(t, t * (race.time - t));
    t += 1;
    count += 1;
  }

  // console.log(race.id, t, count, t*t, race.distance)

  return count;
}

function run(data: string) {
  const parsedData = parse(data);
  // console.log(parsedData.map(score));
  return multAcc(parsedData.map(score));
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
