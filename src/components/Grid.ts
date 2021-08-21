import {
  CellType,
  ICell,
  ICellElement,
  ICellPathFinderData,
  IRenderable,
  ISize,
  IWall,
} from "./interfaces";
import { euclideanDistance, removeFromArray, setNeighbors } from "./Cell";

import { Drawer } from "./Drawer";
import p5 from "p5";

export const Grid = (
  p5: p5,
  cols: number,
  rows: number,
  init: {
    startColIndex: number;
    startRowIndex: number;
    endColIndex: number;
    endRowIndex: number;
  },
  wallPercentage: number,
  canvasSize: () => ISize
): IRenderable => {
  const cells: ICell[] = [];
  const walls: ICellElement[] = [];
  const datas: ICellPathFinderData[][] = Array(cols);
  const openSet: ICellPathFinderData[] = [];
  const closeSet: ICellPathFinderData[] = [];
  let path: ICell[] = [];
  let start: ICellPathFinderData | undefined;
  let end: ICellPathFinderData | undefined;
  let endCell: ICell | undefined;
  const drawer = Drawer();
  let width = 0;
  let height = 0;
  return {
    setup: () => {
      const r = canvasSize();
      width = r.width / cols;
      height = r.height / rows;

      for (let col = 0; col < cols; col++) {
        datas[col] = Array(rows);
        for (let row = 0; row < rows; row++) {
          const isWall = Math.random() < wallPercentage;
          const isStart =
            col === init.startColIndex && row === init.startRowIndex;
          const isTarget = col === init.endColIndex && row === init.endRowIndex;
          if (isWall && !isStart && !isTarget) {
            const wall: IWall = {
              col,
              row,
            };
            walls.push(wall);
            continue;
          }
          const data: ICellPathFinderData = {
            f: 0,
            g: 0,
            h: 0,
            neighbors: [],
            previous: undefined,
            getDistance: (to: ICellElement) =>
              euclideanDistance(p5, col, row, to.row, to.col),
          };
          const cell: ICell = {
            col,
            row,
            data,
            types: 0,
            // highlight: false,
          };
          data.element = cell;
          datas[col]![row] = data;
          cells.push(cell);
        }
      }
      setNeighbors(cols, rows, datas);

      start = datas[init.startColIndex]![init.startRowIndex];
      start!.element!.types = CellType.OpenSet;

      end = datas[init.endColIndex]![init.endRowIndex]!;
      endCell = end.element;
      endCell!.types = CellType.Target;

      openSet.push(start!);
    },
    draw: () => {
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
        if (current == end) {
          p5.noLoop();
        }

        path = [];
        let tmp = current.element!;
        path.push(tmp);
        while (tmp.data.previous) {
          path.push(tmp.data.previous.element!);
          tmp = tmp.data.previous.element!;
        }

        removeFromArray(openSet, current);
        closeSet.push(current);
        current.element!.types = CellType.OpenSet;
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
              neighbor.h = neighbor.getDistance(endCell!);
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.previous = current;
            }
          }
        }
      } else {
        p5.noLoop();
      }
      p5.background(255);
      endCell!.types = CellType.Target;

      drawer.drawWalls(p5, walls, width, height);
      drawer.drawCells(p5, cells, width, height);

      drawer.drawPath(p5, path, width, height);
    },
  };
};
