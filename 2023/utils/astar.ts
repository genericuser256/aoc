import { Pt2d } from "./utils";



export function aStar<T>(
  grid: T[][],
  start: Pt2d,
  canMove: (grid: T[][], from: Pt2d, to: Pt2d) => boolean
) {
    const openList = [start]
    while (openList.length) {

    }
    // push startNode onto openList
// while(openList is not empty) {
//  currentNode = find lowest f in openList
//  if currentNode is final, return the successful path
//  push currentNode onto closedList and remove from openList
//  foreach neighbor of currentNode {
//      if neighbor is not in openList {
//             save g, h, and f then save the current parent
//             add neighbor to openList
//      }
//      if neighbor is in openList but the current g is better than previous g {
//              save g and f, then save the current parent
//      }
//  }
}
