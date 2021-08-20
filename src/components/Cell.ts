import { ICellElement, ICellPathFinderData } from "./interfaces";

import p5 from "p5";

export const setNeighbors = (
  cols: number,
  rows: number,
  cells: ICellPathFinderData[][]
) => {  
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (!cells[col]) continue;
      if (!cells[col]![row]) continue;
      const neighbors = cells[col]![row]!.neighbors;
      if (!neighbors) continue;
      if (col < cols - 1) {
        neighbors.push(cells[col + 1]![row]!);
      }
      if (col > 0) {
        neighbors.push(cells[col - 1]![row]!);
      }
      if (row < rows - 1) {
        neighbors.push(cells[col]![row + 1]!);
      }
      if (row > 0) {
        neighbors.push(cells[col]![row - 1]!);
      }
      // Diagonals neighbors
      if (col > 0 && row > 0) {
        neighbors.push(cells[col - 1]![row - 1]!);
      }
      if (col > cols - 1 && row > 0) {
        neighbors.push(cells[col + 1]![row - 1]!);
      }
      if (col > 0 && row < rows - 1) {
        neighbors.push(cells[col - 1]![row + 1]!);
      }
      if (col < cols - 1 && row < rows - 1) {
        neighbors.push(cells[col + 1]![row + 1]!);
      }
    }
  }
};

export const removeFromArray = <T>(arr: Array<T>, element: any) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == element) {
      arr.splice(i, 1);
    }
  }
};

export const euclideanDistance = (
  p5: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => p5.dist(x1, y1, x2, y2);

export const taxyCabDistance = (a: ICellElement, b: ICellElement) =>
  Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
