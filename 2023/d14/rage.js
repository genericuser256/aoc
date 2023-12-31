const parseInput = (input) => {
  return input
    .split("\n")
    .filter((a) => a.length)
    .map((l) => l.split(""));
};

const tiltLeft = (data, row) => {
  for (let i = 1; i < data[row].length; i++) {
    let currI = i;
    let nextI = i - 1;
    while (data[row][currI] === "O" && data[row][nextI] === "." && nextI >= 0) {
      data[row][currI] = ".";
      data[row][nextI] = "O";
      nextI--;
      currI--;
    }
  }
};

const tiltRight = (data, row) => {
  for (let i = data[row].length - 1; i >= 0; i--) {
    let currI = i;
    let nextI = i + 1;
    while (
      data[row][currI] === "O" &&
      data[row][nextI] === "." &&
      nextI < data[row].length
    ) {
      data[row][currI] = ".";
      data[row][nextI] = "O";
      nextI++;
      currI++;
    }
  }
};

const tiltNorth = (data) => {
  const rotated = Zac.transpose(data);
  rotated.forEach((_, i) => tiltLeft(rotated, i));
  return Zac.transpose(rotated);
};

const tiltEast = (data) => {
  data.forEach((_, i) => tiltLeft(data, i));
  return data;
};

const tiltSouth = (data) => {
  const rotated = Zac.transpose(data);
  rotated.forEach((_, i) => tiltRight(rotated, i));
  return Zac.transpose(rotated);
};

const tiltWest = (data) => {
  data.forEach((_, i) => tiltRight(data, i));
  return data;
};

const getScore = (data) => {
  return Zac.transpose(data).reduce((sum, row) => {
    return (
      sum +
      row.reduce((acc, item, index) => {
        return item === "O" ? acc + (row.length - index) : acc;
      }, 0)
    );
  }, 0);
};

const partOne = (parsedInput) => {
  let data = Zac.clone(parsedInput);
  data = tiltNorth(data);
  return getScore(data);
};

const partTwo = (parsedInput) => {
  let data = Zac.clone(parsedInput);
  let cache = {};
  let foundCycle = false;
  const tiltCycle = Zac.pipe(tiltNorth, tiltEast, tiltSouth, tiltWest);
  for (let i = 0; i < 1000000000; i++) {
    data = tiltCycle(data);

    if (!foundCycle) {
      const key = data.map((l) => l.join("")).join(",");
      if (cache.hasOwnProperty(key)) {
        foundCycle = true;
        const cycleLength = i - cache[key];
        const numCyclesFit =
          Math.floor((1000000000 - cache[key]) / cycleLength) - 1;
        i += numCyclesFit * cycleLength;
      }
      cache[key] = i;
    }
  }

  return getScore(data);
};

// Zone of Algorithmic Convenience
Zac = {};
Zac.clone = (data) => JSON.parse(JSON.stringify(data));
Zac.transpose = function transpose(a) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) {
      return r[c];
    });
  });
};
Zac.pipe =
  (...functions) =>
  (input) =>
    functions.reduce((acc, fn) => fn(acc), input);

console.log(
  partTwo(
    parseInput(`O.#.#..OOO...#..#..O##..#...#.O#O.#O#...#O...OOO...#..O.....O.....#..#.O.#.........#.O#...#.OO....O#
O...O##O....O.#.#...#..#O..........#.....OO.O#.O...O.O#....O.O..O....#.#...OOO....O...O.....#.O.OO#.
..OO..O.#...#.#..O#.....#.O###..#.....O.O.O......#..........#...#..O.#.O..O..#OO.#......O.#O..#...O.
.#O..O...##..#.O.#...#..##.OO...#O.O...O.#..#O#O.O.#..........#.O...OO.....O#......O..O#OO...O#..OO.
.O#.#...O..O...OO....O.O..#.......O.#..O.#..#..O...#O.OO..#O.OO.O......O.......O..O..#...O..O.O#....
...OO..#..O.##....O..#.OOO..#......O#..OO..#.#..#.#......O...O.....O.OO....#...OO#...O...#.OO.O....#
..O#.#.#.##.#.#....#.O#...#..O##...#..O...O...#.O..#.O.OO.....O.O....#...O##.O.O.........O.O##...O#O
O.#O#....O....O..OO#O.O.......#.OO.O.##O..#..OO..#OO.#O...##..O..#..O#....#..#....O###......O..#...O
#OOO....#O#.O#.O.....O.OO......##....O......#OO...O.O.O#O#....O..O.......O.#.#.OO#O..O...#O.#....#.O
..O..O....#....#.#...##.#OO.....O.#O..#O........O.....#O.#...#O###......#.O...#.....OO....#.O.......
.O.##OOO..O..OO........OO#...O....O.O#.###...##......##..#..O....O.O#O.....#O....O.#..#O#.#....#.O..
.##O#O#..O.OOO......O.O.###.#..O.#.##O..O..#.##O.##.....O.O#.O#...OO.#.O.O.O..#..O..#OO...OOO......O
O#...##O......O#........O..#...O.#.O.##....O...#....O..#.#....O.#..........O.O..#O....OO.....O.#....
..O....#O...O#..O#.....#.....OOOO.OOOOO#..O....#.....#.O#..O...#.........O.....O....#O#....O..OO.O..
.#O.#..#..##...#.#O##O...#O....#.O.O.O....O.#......O........##.OOO...#......#..#..O.#..#O.O.O.O.#.O.
O....O..#.O##..#..O.##.O...O...O.#.....#....#.........OO.#O.OO...OO..O.O#...O...O.....#..#.O..#O....
O..#......#.##.O#..#O.....O#......O......#........###O#O.....OO.....O.##.O.O.O.##.##..#.O.....O....#
O..#...#O.#.OOO..........O.O..###.....##..#.##.O..##.....O..#OO...##...O#O#.O...O..O#.##...O..#O....
......O.......#....OOO...#O.O.#....OO#.#.#.##...O...#...O.OO....O.#.###..O.O..O##O.....O............
.....O..#.........O#....O#.O......##.O.....#.##OO....O...O.....#..O.OO.O..#..#.....#O..O.#.#..O.O#.#
...#......#.O.O.O.O#...#O....#.OO.......O..#..#.O.#......#.#.O##..O....#.#...O#...O...#..#.O....O#.O
O#.O..#.OO......O.O#.O.#.O.O#....O..OO.O..#.....#.....OOOO..##O#.O.......#...........O.#.#.O....OO#O
O....#.OO##.##.O..#.OO...O...O.O.#......O..O...##.#...#....OO..#....O.O..#O..#.....#........O....#O.
#O.O##..#O.#OO.#....OO#...O#.##.#.##...O....O...#O..O....#O#.#..#....O..O.#..#OO..O#..#O..O....O..O.
O.#O..O.O#..#...O.O..O.OOO.OO...OO#OO.O.O.OO#..#.#.........O#...O..O#..#.....OO.....#..OO...#...#..O
#...#....O#....#....#..#..........O........OO..#...OO.....O..OO#O..O..O..O..##..#....#.O.O....#.O...
#....O...O#O#......O...O...OOO.....O.O...O.OO#...O....OO.....O..O....O.O#..OO.O.#.O.O...O.O#.O#.....
.#....O....##..O.O.##...#.#OO.#.#OO......#.......O....O..#..##.#O...##O.O.#...#..O.O#....O....#OO.#.
.#.OO...#.OOOO......#.O.O...O.O...#....O....#.O..#OO....O......OO.....##.#.OOO#..#.#O#.....O....#..O
.....O.....O#..O.O.##O.O.#...O#OO...#....#O.........##...#.....#.O.O#..O.........OO..O...#......#.#.
.........O.#.#..O..#.#.OOO#O..##O..O#..OO...O.O#.O...###.........O...O..O..O...#O..O....#..#...#O.OO
.#O..O....#..##.....#..O.OO...#.#OO.#.#........##.O.....#..........#.#.O#O..OO.OO.#...O....#...O...#
.O.O....#OO.#..O...O...O#.OOO#......#.O...O...##.OO..#..OOO.#.#OO......##OO....#....###.O#...#O#...O
.O#.....#...#O.O.....O...#.O#O....O.O....#..#####..............O.#...O#O#OOOO...#.#...O..O.#.OO.O..#
...#.#..O.#......O...O##.#....#.O......#.....O......#O#.O.OO....OO..#O.O.#.O.#...O#..O##.#O.O..OO.O#
##OO...O....O.##..O.....#..OO##.#.#.O..........O#.O....O##...O.O....#O..O.O.##...#.#O##.......OO...O
#O.#.......#........O......O....#........#O##..O.O..OO..O......OO.....O#O..OO.#......#O.....#.......
....OO...OO.#.#...#..........O#....O#.#.#OOO..#......#.OO#..#O..........O..O....#....O..O.....#.....
.......##O.....#O..#OO..#OO..#O.....O..O.#.O#OO........O.O..O..O......OO...#...OO#.#.##O...#O..#..#.
O......#..O#.........#O.OO#O..#.O......O.#.O.....##..#.O.....OO..O.#..O...O.#...O#.O.#O..O..#...OOO#
..O.O##...O..OO#....#O...OO.....#..O.O.........OO#....O..#...OO...............OO.O...#........#OO.O#
#.....O.....O.#.....O..#O#O#..#.O.#.O...O.O.#.O...#O..#..O.O....O.O..##.#OO.#.O..................O#.
...O....O.OO...O.OO.O......O......O.O#.OO.....O.O..#...O#O#.......#.#OO..#...O..#..O..OO..OOOO.O.O..
.#..OO.O...#.O.....#...##.O....#.....#OO#O.#..#.O...........#O..O....O....#O...O....#.#...O#....O...
....O..####...O..........O..OO.#.#..#....##...##.O.#.....O.#O.#...##.......OO.O.......#.#O.O.O.#..O.
#..#..#.OO..#.#..#####..O#OOO..OO.#.##.O.O.O.O..O...O.O###.....#.#.#........O.O....#.O...#.#.#.....#
.OO.#O...##...#..O..#O..O.#.#O........O..#..O....O..#..OO.O...#..#.#......#..#O........##.O.....O...
O.....#.O.O.#..O.#..O...OOO..#.OOO#..O......O#..O..O#...#O#...O..........O...O.O##....O.O.O.....O..O
#.#O.O.#O#...O..#.#......##..O.OOOO....O.#.....O..O..OO....O.O##....O#.#..O.O.O#.......OO..#O.......
...O...#......O#.O#..O###.......#.O....O#O.#.O.O#..O##...#....O..OOO....O..O.....#..#O.....O.OO.....
O..O....#O#....#..O....#..##..........O..#.OO.....OO.O.#O..#O.O#O....OO.O....#.O.#O.OO...#..#..O...#
#.O#OO.OO#.O#.#....#.......O..OO...#.O...OOO.O..O...OO#..O..#.O..#..OO....#.#......#O......#.O..O..O
.#.......#....#.O#O..O..........#.O.O.......##.#.O#####.....O.O.....#....O.#.O...O...OO#.#O.O##.....
O.O......OO....#.#........##.O.#.O.#...O#OO......O..#.O...O.O..O#.....#O#.OO#....OO.#.#....#..#..#.O
O.....OO...#O...#.O..O.....O.OO.#.##.OOO##..#.O.OO.##...O.O.......O.#......#.O#.....O.#..O...O......
......O.##.#.............O.O.O#.##..#O#O..O..O.#.O.#O..#....#.......O.......O...O#..###.OO...O#OO...
O.#..##O..#O......O.#.#.OO.O#O.O##..O.OO..OO#.OO...O..#.#...O...O.#.#...O....O#...##..O#......#...OO
...OO...O#.O.O......O...#..O##.#OOOO.O.##O....O##..#...O.OO.......##..OO#.O......O#O...O..#.......O.
..#.O#O#.O#......#....O.OO..O#.O..#.....O....#..OO#.#.O#.O........O..OOO#OO.OOOO..O.....#.O...#..#.#
.O.....#.#.#.#O.......O..O#..#O#.....O.##.......OO......#OO.....#OO.#.....##...O.O...O..O..O......##
.O#.#O...#..#.OO#OO#.O.O.......#..OO#.#O.O#O.O.##..O..#.....OO#.....O..O..OO.O.O#.#.#..O.......OO.O.
.#OO..#.......O.O....#....O...O..#......#.#OO.O#...O..O..O.###.....#.#............O....O....O.OOOO.O
OO..#O#...#O..##.........O#...#......O...#....O....#O......O.......#.O.......##...#OO...#..###...###
#.O#O#OOO...#.......O......O...#O..#......#....OOO.#O.....O....#....##.O#.#....O.O........#..#.O...#
.O...#..##O..O..##.O#....OO#..#O#OOO.OOO#.#.#..#.O.....O#O..O.O..#..OOOO..O..O...#.#.#..O.O....O....
...#.OOO.OO....O#O#....##..OO...O..O..O......O...#O#O...O.#O..##O.......O..O#.......##O..........OOO
.....OO...O....OO.O..O..O##..OO...#.O.##...O.##.#..#O..........O....O...O.OO..O..O#..O.#..O#..#.O#..
.O..O#.O.O.#...O...O.O......O..O..OO..OOO#..O.....#...O#..###..O.O.....#..##...O#....#.O.......#...O
.O........O#O.#.#O#O...O.O...#O...O..O........O#O.##..O...#.....O..O........O#.#...O..OO..O...O#O...
#.##..#O....#..O...O##..##..O..#....##O...#.O.#...##...O.O..O#O..O.#.....O...O#......OO....O.#....##
O#..#O...#......#OOOO..OO.#O.....O..OO..#.....#..O....O....OO..#...O.O.....O#...#.......O#..O.......
#O...O........O##O.#....O..O...##.#O...O.O.O......O....O.O#.O#O....#.O....O#....##O.#..O....##.O..OO
..#....O.##...#.#O#...#..O....#...#.#..O..#..#.O.#.O..####.O.O.####.OO..OO...OO...#....OO.##O.O.#.O.
..OOOO..#.....O...#O#O.O.....#....##....O..O....O..O.O.....O.#..O..#O....O.OO..OOO#..#.#O...#.#..O..
.#.O......#..O#.#..##.###..#..#.....##......#...#O.#.O..#O..O.O..O.#..#OO.O.#O.O......#..#...O....#.
..#...##.O....#..OO...#O.#..O..#OOO..O.O.....O.#OOO#O....O........O#...O.#..............O.....#.O.#O
......O.OOO.#..............#O...#.O........#..O.......O.....#.O..#O........#O##..O##O#.....O.....O.O
.#.#....OO.##...OO...O#O.O.#.O..O.O.O...#...#...........O...O.O##.#..#O..O.....O#....O..#.....#....#
.O....O#O.#.#.O..O..#....#..O.OO...#.O.....#O...........O.......O....O......##.....OOO..#......O.O#.
##...#...O.....O......OOO#...#O...O##.......#O..O......O......O..O.#.O#O..O..O....O.....#..O...O...#
......O#.#...#.O.O#.##.#O#OO.##.O#.....O.O..O....O.O#.......O#OO...O...#.....O#...#.#..O.O..#O#..O##
OO.#.OO#..#....O.#O#.O..#...#O..OO...#O#.O.O..O..O.O.######O..O#....O#..O.O.....O##.O..O.O#O.##O.O..
...O...#...O..#...O.O.O..#OO.O.#O.#.O.....O#.OO..O.#.O.....#.O.#.OOO..O#OO.O....O...O##........O#O..
..#.....O........O#.OOOOO...O.#....OOO.#.O.#..O#O#O..#.#O.O.#O.#O##O........O...#.OO.#.........O.O.O
.....OO...O..#O.O..OO#O...#O........O.O.##......O..#..#OO.....O..###.........O...#....O......OOOOO..
......#...O.....#...#.O.##.OO..O#.O..O.#.#.O.....O......#O.#O.#O#O...O...O..O#.....#.#O#..#.O.#..#.#
OO.#.O..#...OO##..OO....O.#.O###...#.O......OO#....O.....O..#O...#.....O#OO......O.......#.O..#.##O.
.#O....OO.#.#...O......O..O#..O#.O......#O..O#.##...O#...#O#....#.OO..#........O#...O#.O....#....##.
.#.OO....#.#.....O#O.O##O.##O.O.#..##O#..#.#.#O#.OO..O.....###.O.#...##.....#.....O......OO.#O.O..#.
.#O....O.O.O.OO.O..OO...O.###O...O....#.O.OO#O..#....O.##O...O....#OO..O..O...O.#...O..O.#.O...O.#.#
..O........O.O#..#.#.O.O.......OO.#.O...##..O#.#.......#..#...#.#...O.....##.O........#O..#OO.....#.
##...O....O.#.....OOO.#...O.#.........#...#....#.#..#......#..O..##O#.O..O.#.O.##.#........O#.....#.
...O..#O...O......O.#O..#.##...O...O.......OO.#...........O..#.#...OO#....................#O#OO#O...
O#..#O.......O.#OO....O.......OO.O......O.#.....O......#.O.##..O.O#..OO..##O.....###.O...O....OO.O..
.O....#....O...#.O..O.#......O#..O..#OO..O..##...O..O...O.#..O.....O#O.#.OO...#.#.....O#......O...OO
..O.OO...OO...O..O.O.OO.O.#....OOO...O...##O.#O...#....#O.#O.O....OO..O..........O.O.....#.....#OO#.
.OO#...O.#..O.#.OO..O...O.O...##.....#O.#.O.....O...O....#.O...O.##......OOO....O....O.....#.#.O..O.
......#..#...#O.##...O..#OO##...#....#.#.......O.##.##..OO#O.O.....#..O#.O..#O.....#.O.O.#.#..#O#.O#
..#....O#..#O....#.#....O..O#...O...OO......#...#.O.#.##..#....#OOO#.O.O.O...O#...O.O.O.O...O#O...#.
..O.......#OO.OOO......#O#.O.#O.O......O..O.O.O.O.....#.###O.O#OO.#O.#O...O...OO##O#.........O#.....
`)
  )
);
