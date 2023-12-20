import {
  cloneDeep,
  first,
  isEqual,
  last,
  max,
  maxBy,
  min,
  sortBy,
  sum,
  uniq,
} from "lodash";
import {
  Pt2d,
  addPts,
  between,
  dirToStr,
  generateRange,
  getSurrondingPoints,
  getSurrondingPointsOrth,
  isIn,
  mannhattan,
  multAcc,
  repeat,
  stringify,
  subPts,
  transpose,
  ty,
  valueAt,
} from "../utils/utils";

class MinHeap<T> {
  heap: T[];
  constructor(private compare: (a: T, b: T) => number) {
    this.heap = [];
  }

  size() {
    return this.heap.length;
  }

  // Helper Methods
  getLeftChildIndex(parentIndex: number) {
    return 2 * parentIndex + 1;
  }
  getRightChildIndex(parentIndex: number) {
    return 2 * parentIndex + 2;
  }
  getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }
  hasLeftChild(index: number) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }
  hasRightChild(index: number) {
    return this.getRightChildIndex(index) < this.heap.length;
  }
  hasParent(index: number) {
    return this.getParentIndex(index) >= 0;
  }
  leftChild(index: number) {
    return this.heap[this.getLeftChildIndex(index)];
  }
  rightChild(index: number) {
    return this.heap[this.getRightChildIndex(index)];
  }
  parent(index: number) {
    return this.heap[this.getParentIndex(index)];
  }

  // Functions to create Min Heap

  swap(indexOne: number, indexTwo: number) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  // Removing an element will remove the
  // top element with highest priority then
  // heapifyDown will be called
  remove() {
    if (this.heap.length === 0) {
      return null;
    }
    const item = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown();
    return item;
  }

  add(item: T) {
    this.heap.push(item);
    this.heapifyUp();
  }

  leftGreater(a: T, b: T) {
    return this.compare(a, b) > 0;
  }
  rightGreater(a: T, b: T) {
    return this.compare(a, b) < 0;
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (
      this.hasParent(index) &&
      this.leftGreater(this.parent(index), this.heap[index])
    ) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.rightGreater(this.rightChild(index), this.leftChild(index))
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.heap[index] < this.heap[smallerChildIndex]) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  printHeap() {
    var heap = ` ${this.heap[0]} `;
    for (var i = 1; i < this.heap.length; i++) {
      heap += ` ${this.heap[i]} `;
    }
    console.log(heap);
  }
}

function reconstruct_path(cameFrom: Map<string, Pt2d>, current: Pt2d) {
  // total_path := {current}
  // while current in cameFrom.Keys:
  //     current := cameFrom[current]
  //     total_path.prepend(current)
  // return total_path
  const totalPath = [current];
  while (cameFrom.has(stringify(current))) {
    current = cameFrom.get(stringify(current))!;
    totalPath.unshift(current);
  }
  return totalPath;
}

function last2InLine(cameFrom: Map<string, Pt2d>, current: Pt2d): boolean {

  let i =0;
  let next = cameFrom.get(stringify(current))!;
  let lastDir = stringify(subPts(current, next));
  while (cameFrom.has(stringify(current)) && i < 2) {
    const dir = stringify(subPts(current, next));
    if (dir === lastDir) {

    }
    current = next;
    i++;
  }
return false;
}

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function aStar<T>(
  grid: T[][],
  start: Pt2d,
  goal: Pt2d,
  h: (pt: Pt2d) => number,
  d: (a: Pt2d, b: Pt2d) => number,
  getNeighbours: (pt: Pt2d) => Pt2d[]
) {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
  // to n currently known.
  const cameFrom = new Map<string, Pt2d>();

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore = new Map<string, number>();
  gScore.set(stringify(start), 0);
  const getGScore = (pt: Pt2d) => gScore.get(stringify(pt)) ?? Infinity;

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  const fScore = new Map<string, number>();
  fScore.set(stringify(start), h(start));
  const getFScore = (pt: Pt2d) => fScore.get(stringify(pt)) ?? Infinity;

  const toHeapVal = (v: Pt2d) => ({ k: stringify(v), v });
  const openSet = new MinHeap<{ k: string; v: Pt2d }>(
    (a, b) => getFScore(a.v) - getFScore(b.v)
  );
  openSet.add(toHeapVal(start));

  while (openSet.size()) {
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
    // current := the node in openSet having the lowest fScore[] value
    const current = openSet.remove();
    if (!current) {
      throw "current null";
    }
    if (isEqual(current.v, goal)) {
      return reconstruct_path(cameFrom, current.v);
    }

    const neighbours = getNeighbours(current.v);
    neighbours.forEach((neighbour) => {
      const dir = subPts(current.v, neighbour);

      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      // tentative_gScore := gScore[current] + d(current, neighbor)
      const tentativeGScore = getGScore(current.v) + d(current.v, neighbour);
      if (tentativeGScore < getGScore(neighbour)) {
        // This path to neighbor is better than any previous one. Record it!
        // cameFrom[neighbor] := current
        // gScore[neighbor] := tentativeGScore
        // fScore[neighbor] := tentativeGScore + h(neighbor)
        const kn = stringify(neighbour);
        cameFrom.set(kn, current.v);
        gScore.set(kn, tentativeGScore);
        fScore.set(kn, tentativeGScore + h(neighbour));
        if (!openSet.heap.find(({ k }) => k === kn)) {
          openSet.add(toHeapVal(neighbour));
        }
      }
    });
  }
  console.log(gScore, cameFrom, fScore)
  // Open set is empty but goal was never reached
  throw "not found";
}


type Tile = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const seenPts = new Set<string>();
const followed = new Set<string>();

function parseData(data: string) {
  return data
    .split("\n")
    .map((x) => x.split("").map((x) => parseInt(x))) as any as Tile[][];
}

function followPath(
  grid: Tile[][],
  pt: Pt2d,
  dir: Pt2d,
  cost = 0,
  length = 0
): [number, string[]] {
  const fkey = `${stringify(pt)}-${stringify(dir)}`;
  const key = stringify(pt);
  const v: Tile = grid.ptAt(pt);
  // console.log(v, key);
  if (pt.x === grid[0].length - 1 && pt.y === grid.length - 1) {
    // console.log("hi", cost, v);
    return [cost + v, [key]];
  }

  if (followed.has(fkey) || !isIn(grid, pt)) {
    return [Infinity, []];
  }

  seenPts.add(stringify(pt));
  followed.add(fkey);

  const [straight, straightPath] =
    length < 2
      ? followPath(grid, addPts(pt, dir), dir, cost + v, length + 1)
      : [Infinity, []];
  let newDir = dir.x ? { x: 0, y: -1 } : { x: -1, y: 0 };
  const [left, leftPath] = followPath(
    grid,
    addPts(pt, newDir),
    newDir,
    cost + v
  );
  newDir = dir.x ? { x: 0, y: 1 } : { x: 1, y: 0 };
  const [right, rightPath] = followPath(
    grid,
    addPts(pt, newDir),
    newDir,
    cost + v
  );
  if (straight === left && straight === right && straight === Infinity) {
    return [Infinity, []];
  }

  // console.log(
  //   straight !== Infinity ? straight : "",
  //   left !== Infinity ? left : "",
  //   right !== Infinity ? right : ""
  // );
  if (straight <= left && straight <= right) {
    // console.log("s", length, key, dirToStr(dir));
    return [straight, [key, ...straightPath]];
  }
  if (left <= straight && left <= right) {
    // console.log("l", length, key, dirToStr(dir));
    return [left, [key, ...leftPath]];
  }
  if (right <= left && right <= straight) {
    // console.log("r", length, key, dirToStr(dir));
    return [right, [key, ...rightPath]];
  }
  throw "no no no";
}

function run(input: string) {
  const data = parseData(input);
  const n = data.length;
  const m = data[0].length;
  const goal = { x: m - 1, y: n - 1 };
  const res = aStar(
    data,
    { x: 0, y: 0 },
    goal,
    (a) => 5 * mannhattan(a, goal),
    (a, b) => data.ptAt(a),
    (pt) => getSurrondingPointsOrth(pt, data)
  );

  return res;
  const [x, y] = followPath(data, { x: 0, y: 0 }, { x: 1, y: 0 });
  console.log(y.join("\n"));
  return x;
}

export default (day: number, data: string, example: string, input: string) => {
  return run(data);
};
