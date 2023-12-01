import { readFileSync } from "fs";
import { DateTime } from "luxon";
import minimist from "minimist";

const args = minimist(Bun.argv);

const day = args.day || args.d || DateTime.now().day;
let part = args.part || args.p || 2;
const useExample = Boolean(args.example || args.e);

const toRun = Bun.file(`./d${day}/p${part}.ts`);
let module;
if (await toRun.exists()) {
  console.log("Running", `d${day}/p${part}.ts`);
  module = await import(`./d${day}/p${part}.ts`);
} else {
  part = "";
  console.log("Running", `d${day}/p1.ts`);
  module = await import(`./d${day}/p1.ts`);
}

const example = readFileSync(`./d${day}/example${part}.txt`, {
  encoding: "utf8",
}).trim();
const input = readFileSync(`./d${day}/input.txt`, { encoding: "utf8" }).trim();
module.default(day, useExample ? example : input, example, input);
