import { CellType, ICell, IRenderable, ISize, IWall } from "./interfaces";
import { ICellElement, ICellPathFinderData, PathFinder } from "../pathfinder";

import { Drawer } from "./Drawer";
import p5 from "p5";
import { setNeighbors } from "./Cell";

export const Agent = (p5: p5, datas: ICellPathFinderData[][]) => {
  const validDatas = datas.flatMap((d) => d).filter((d) => d);

  const start = validDatas[Math.trunc(p5.random(0, validDatas.length - 1))];
  const end = validDatas[Math.trunc(p5.random(0, validDatas.length - 1))];

  const result = PathFinder({
    start: start!,
    end: end!,
  });

  return {
    ...result,
    start,
    end,
  };
};

const createAgent = (p5: p5, datas: ICellPathFinderData[][]) => {
  const result = Agent(p5, datas);

  for (const cell of result.openSet) {
    cell.element!.types = CellType.OpenSet;
  }

  for (const cell of result.closeSet) {
    cell.element!.types = CellType.CloseSet;
  }

  result.end!.element!.types = CellType.Target;
  return result.path.map((p) => p.element);
};

export const Grid = (
  p5: p5,
  cols: number,
  rows: number,
  wallPercentage: number,
  canvasSize: () => ISize
): IRenderable => {
  const cells: ICell[] = [];
  const walls: ICellElement[] = [];
  const datas: ICellPathFinderData[][] = Array(cols);
  let cellWidth = 0;
  let cellHeight = 0;
  const drawer = Drawer();
  const paths: ICellElement[][] = [];

  return {
    setup: () => {
      const canvasS = canvasSize();
      cellWidth = canvasS.width / cols;
      cellHeight = canvasS.height / rows;

      for (let col = 0; col < cols; col++) {
        datas[col] = Array(rows);
        for (let row = 0; row < rows; row++) {
          const isWall = Math.random() < wallPercentage;
          if (isWall) {
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
      paths.push(createAgent(p5, datas));
      paths.push(createAgent(p5, datas));
      paths.push(createAgent(p5, datas));
      paths.push(createAgent(p5, datas));
    },
    draw: () => {
      p5.background(255);
      drawer.drawCells(p5, cells, cellWidth, cellHeight);
      for (const path of paths) {
        drawer.drawPath(p5, path, cellWidth, cellHeight);
      }
      drawer.drawWalls(p5, walls, cellWidth, cellHeight);
    },
  };
};
