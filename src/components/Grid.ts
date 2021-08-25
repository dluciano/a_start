import { drawCell, drawIndicator, drawPath, drawWall } from "../drawers";

import { IPosition } from "./interfaces";
import { createRandomMap } from "./Map";
import { finPathByAStartAlg } from "../pathfinder";
import { mapIndexToPosition } from "../common";
import p5 from "p5";

const getRandomPositionFromCell = (
  p5: p5,
  map: boolean[][],
  cols: number,
  rows: number
) => {
  const cells = map
    .flatMap((m) => m)
    .map((m, i) => ({ val: m, idx: i }))
    .filter((m) => !m.val);
  const startIdx = Math.trunc(p5.random(0, cells.length));
  const position = mapIndexToPosition(cells[startIdx]!.idx, rows, cols);
  return position;
};

type Maze = {
  path: IPosition[];
  startPos: IPosition;
  endPos: IPosition;
};

const createMaze = (
  p5: p5,
  map: boolean[][],
  cols: number,
  rows: number
): Maze => {
  const startPos = getRandomPositionFromCell(p5, map, cols, rows);
  const endPos = getRandomPositionFromCell(p5, map, cols, rows);
  const result = finPathByAStartAlg({
    map,
    cols,
    rows,
    start: startPos,
    end: endPos,
  });
  const path = result.path.map((p) => ({
    col: p.element.col,
    row: p.element.row,
  }));
  return {
    path,
    startPos,
    endPos,
  };
};

export const Grid = (
  p5: p5,
  cols: number,
  rows: number,
  wallPercentage: number,
  canvasSize: () => { width: number; height: number }
) => {
  let cellWidth = 0;
  let cellHeight = 0;
  let map: boolean[][];
  const mazes: Maze[] = [];

  return {
    setup: () => {
      const canvasS = canvasSize();
      cellWidth = canvasS.width / cols;
      cellHeight = canvasS.height / rows;
      map = createRandomMap(cols, rows, wallPercentage);
      for (let i = 0; i < 3; i++) {
        mazes.push(createMaze(p5, map, cols, rows));
      }
    },
    draw: () => {
      p5.background(155);
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const isWall = map[col]![row];
          if (isWall) drawWall(p5, { col, row }, cellWidth, cellHeight);
          else drawCell(p5, { col, row }, cellWidth, cellHeight);
        }
      }
      for (const maze of mazes) {
        drawPath(p5, maze.path, cellWidth, cellHeight);
        drawIndicator(p5, maze.startPos, true, cellWidth, cellHeight);
        drawIndicator(p5, maze.endPos, false, cellWidth, cellHeight);
      }
    },
  };
};
