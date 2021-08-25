import { ICellPathFinderData, createCells } from "./Cell";

import { euclideanDistance } from "../distance-formulas";
import { removeFromArray } from "../common";

export type AStartRequest = {
  start: {col: number, row: number};
  end: {col: number, row: number};
  map: boolean[][];
  cols: number;
  rows: number;
};

export type AStartDataResult = {
  solved: boolean;
  doesNotHaveSolution: boolean;
  openSet: ICellPathFinderData[];
  closeSet: ICellPathFinderData[];
  path: ICellPathFinderData[];
};

export const finPathByAStartAlg = ({
  map,
  cols,
  rows,
  start,
  end
}: AStartRequest): AStartDataResult => {
  const cells = createCells(cols, rows, map);
  const startCell=cells[start.col]![start.row]!;
  const endCell=cells[end.col]![end.row]!;
  
  const openSet: ICellPathFinderData[] = [];
  const closeSet: ICellPathFinderData[] = [];
  openSet.push(startCell!);
  while (true) {
    if (openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        const cell = openSet[i]!;
        const winnerCell = openSet[winner]!;
        if (cell.f < winnerCell.f) {
          winner = i;
        }
      }

      const current = openSet[winner]!;

      if (current == endCell) {
        const path: ICellPathFinderData[] = [];
        let tmp = current;
        path.push(tmp);

        while (tmp.previous) {
          path.push(tmp.previous);
          tmp = tmp.previous;
        }

        return {
          openSet,
          closeSet,
          solved: true,
          doesNotHaveSolution: false,
          path: path.reverse(),
        };
      }

      removeFromArray(openSet, current);

      closeSet.push(current);
      const neighbors = current.neighbors;

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i]!;
        if (!neighbor) continue;
        if (!closeSet.includes(neighbor)) {
          const tentative_gScore = current.g + 1;
          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tentative_gScore < neighbor.g) {
              neighbor.g = tentative_gScore;
              newPath = true;
            }
          } else {
            neighbor.g = tentative_gScore;
            newPath = true;
            openSet.push(neighbor);
          }
          if (newPath) {
            neighbor.h = euclideanDistance(
              neighbor.element.col,
              neighbor.element.row,
              endCell.element.col,
              endCell.element.row
            );
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }
    } else {
      return {
        openSet,
        closeSet,
        doesNotHaveSolution: true,
        path: [],
        solved: true,
      };
    }
  }
};
