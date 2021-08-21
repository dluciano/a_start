import {
  CellType,
  ICell,
  IRenderable,
  ISize,
  IWall,
} from "./interfaces";
import { ICellElement, ICellPathFinderData, PathFinder } from "../pathfinder";

import { Drawer } from "./Drawer";
import p5 from "p5";
import { setNeighbors } from "./Cell";

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
  let path: ICellElement[] = [];
  const drawer = Drawer();
  let cellWidth = 0;
  let cellHeight = 0;

  return {
    setup: () => {
      const canvasS = canvasSize();
      cellWidth = canvasS.width / cols;
      cellHeight = canvasS.height / rows;

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

          const cell: ICell = {
            col,
            row,
            data: undefined,
            types: 0,
            // highlight: false,
          };
          const data: ICellPathFinderData = {
            f: 0,
            g: 0,
            h: 0,
            neighbors: [],
            previous: undefined,
            element: cell,
          };
          cell.data = data;
          datas[col]![row] = data;
          cells.push(cell);
        }
      }
      setNeighbors(cols, rows, datas);

      const start = datas[init.startColIndex]![init.startRowIndex];
      const end = datas[init.endColIndex]![init.endRowIndex]!;

      const result = PathFinder({
        start: start!,
        end: end! 
      });
      path = result.path.map((p) => p.element);

      for (const cell of result.openSet) {
        cell.element!.types = CellType.OpenSet;
      }
      for (const cell of result.closeSet) {
        cell.element!.types = CellType.CloseSet;
      }

      end.element!.types = CellType.Target;
    },
    draw: () => {
      p5.background(255);
      drawer.drawCells(p5, cells, cellWidth, cellHeight);
      drawer.drawPath(p5, path, cellWidth, cellHeight);
      drawer.drawWalls(p5, walls, cellWidth, cellHeight);
    },
  };
};
