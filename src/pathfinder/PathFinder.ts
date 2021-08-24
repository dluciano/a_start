import { euclideanDistance, removeFromArray } from "../common";

export interface ICellElement {
  readonly row: number;
  readonly col: number;
}

export interface ICellPathFinderData {
  f: number;
  g: number;
  h: number;
  neighbors: ICellPathFinderData[];
  previous?: ICellPathFinderData;
  element: ICellElement;
}

export type AAsteriskRequest = {
  start: ICellPathFinderData;
  end: ICellPathFinderData;
};

export type AAsteriskDataResult = {
  solved: boolean;
  doesNotHaveSolution: boolean;
  openSet: ICellPathFinderData[];
  closeSet: ICellPathFinderData[];
  path: ICellPathFinderData[];
};

export const PathFinder = ({
  start,
  end,
}: AAsteriskRequest): AAsteriskDataResult => {
  const openSet: ICellPathFinderData[] = [];
  const closeSet: ICellPathFinderData[] = [];
  openSet.push(start!);
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
      const path: ICellPathFinderData[] = [];
      let tmp = current;
      path.push(tmp);

      while (tmp.previous) {
        path.push(tmp.previous);
        tmp = tmp.previous;
      }

      if (current == end) {
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
              end.element.col,
              end.element.row
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
