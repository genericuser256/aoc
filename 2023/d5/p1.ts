import { min, sum } from "lodash";
import { between, multAcc } from "../utils/utils";

interface Map {
  destination: number;
  source: number;
  range: number;
}

interface ParsedData {
  seeds: number[];
  seedToSoil: Map[];
  soilToFertilizer: Map[];
  fertilizerToWater: Map[];
  waterToLight: Map[];
  lightToTemperature: Map[];
  temperatureToHumidity: Map[];
  humidityToLocation: Map[];
}

const keys: Array<keyof Omit<ParsedData, "seeds">> = [
  "seedToSoil",
  "soilToFertilizer",
  "fertilizerToWater",
  "waterToLight",
  "lightToTemperature",
  "temperatureToHumidity",
  "humidityToLocation",
];

function parse(data: string): ParsedData {
  const lines = data.split("\n");
  const ret: ParsedData = {
    seeds: lines[0]
      .split(":")[1]
      .trim()
      .split(/\s+/)
      .map((x) => parseInt(x)),
    seedToSoil: [],
    soilToFertilizer: [],
    fertilizerToWater: [],
    waterToLight: [],
    lightToTemperature: [],
    temperatureToHumidity: [],
    humidityToLocation: [],
  };

  let k = 0;
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) {
      k++;
      continue;
    }
    if (line.includes("map")) {
      continue;
    }
    const x = line.split(/\s+/).map((x) => parseInt(x));
    ret[keys[k]].push({
      destination: x[0],
      source: x[1],
      range: x[2],
    });
  }

  return ret;
}

function run(data: string) {
  const parsedData = parse(data);
  // console.log(parsedData)
  let locations = [...parsedData.seeds];

  keys.forEach((k) => {
    const maps = parsedData[k];
    const newLocations: number[] = [];
    maps.forEach(({ source, destination, range }) => {
      locations.forEach((l) => {
        if (between(l, source, source + range)) {
          newLocations.push(destination + (l - source));
          locations = locations.filter(x => x !== l);
        }
      });
    });
    // console.log(k, locations, newLocations);
    locations = [...newLocations, ...locations];
  });

  return min(locations);
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
