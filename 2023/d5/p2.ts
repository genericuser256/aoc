import { chunk, min, minBy, pullAt, sortBy, sum } from "lodash";


export interface Range {
  start: bigint;
  end: bigint;
}

interface Map {
  destination: Range;
  source: Range;
}

interface ParsedData {
  seeds: Range[];
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

const b1: bigint = BigInt(1)

function parse(data: string): ParsedData {
  const lines = data.split("\n");
  const seeds = chunk(
    lines[0]
      .split(":")[1]
      .trim()
      .split(/\s+/)
      .map((x) => BigInt(x)),
    2
  ).map(([s, c]) => ({ start: s, end: s + c - b1 }));
  // console.log(seeds)
  const ret: ParsedData = {
    seeds,
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
    if (!keys[k]) {
      break;
    }
    const x = line.split(/\s+/).map((x) => BigInt(x));
    ret[keys[k]].push({
      destination: {
        start: x[0],
        end: x[0] + x[2],
      },
      source: {
        start: x[1],
        end: x[1] + x[2],
      },
    });
  }

  return ret;
}

function stringify(arr: Range[]): string {
  return sortBy(arr, "start")
    .map(({ start, end }) => `${start} -> ${end}`)
    .join(", ");
}

function run(data: string) {
  const parsedData = parse(data);
  // console.log(JSON.stringify(parsedData));
  let locations = [...parsedData.seeds];

  keys.forEach((k) => {
    const maps = parsedData[k];
    const newLocations: Range[] = [];
    const locClone = [...locations];
    maps.forEach(({ source, destination }) => {
      for (let i = 0; i < locations.length; i++) {
        const { start, end } = locations[i];

        // a a b b
        // b b a a
        if (
          (start < source.start && end < source.start) ||
          (source.start < start && source.end < start)
        ) {
          continue;
        }

        // a ab b
        if (start < source.start && end === source.start) {
          pullAt(locations, i);
          i--;
          locations.push({ start, end: end - b1 });
          newLocations.push({ start: destination.end, end: destination.end });
          continue;
        }

        // b ba a
        if (end > source.end && start === source.end) {
          pullAt(locations, i);
          i--;
          locations.push({ start: start + b1, end });
          newLocations.push({
            start: destination.start,
            end: destination.start,
          });
          continue;
        }

        // a b a b
        if (start < source.start && end > source.start && end < source.end) {
          pullAt(locations, i);
          i--;
          locations.push({ start, end: source.start - b1 });
          newLocations.push({
            start: destination.start,
            end: destination.start + (end - source.start),
          });
          continue;
        }

        // b a b a
        if (end > source.end && start < source.end && start > source.start) {
          pullAt(locations, i);
          i--;
          locations.push({ start: source.end + b1, end });
          newLocations.push({
            start: destination.start + (source.end - start),
            end: destination.end,
          });
          continue;
        }

        // a b b a
        if (start < source.start && end > source.end) {
          pullAt(locations, i);
          i--;
          locations.push(
            { start, end: source.start - b1 },
            { start: source.end + b1, end }
          );
          newLocations.push({
            start: destination.start,
            end: destination.end,
          });
          continue;
        }

        // b a a b
        if (start >= source.start && end <= source.end) {
          pullAt(locations, i);
          i--;
          newLocations.push({
            start: destination.start + (start - source.start),
            end: destination.start + (end - source.start),
          });
          continue;
        }
      }
    });
    // console.log(k);
    // console.log("lc", stringify(locClone));
    // console.log("l", stringify(locations));
    // console.log("n", stringify(newLocations), "\n");
    locations = [...newLocations, ...locations];
  });

  return minBy(locations, "start");
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
