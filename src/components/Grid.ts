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

type SeekAndDestroy = {
  attacker: Maze | undefined;
  target: Maze | undefined;
};

const createMaze = (
  map: boolean[][],
  cols: number,
  rows: number,
  startPos: IPosition,
  endPos: IPosition
): Maze => {
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
  let seekAndDestroyObjects: SeekAndDestroy = {
    attacker: undefined,
    target: undefined,
  };  
  const paths: IPosition[][] = [];
  return {
    setup: () => {
      const canvasS = canvasSize();
      cellWidth = canvasS.width / cols;
      cellHeight = canvasS.height / rows;
      map = createRandomMap(cols, rows, wallPercentage);

      const targetStartPos: IPosition = getRandomPositionFromCell(
        p5,
        map,
        cols,
        rows
      );
      const targetEndPos: IPosition = getRandomPositionFromCell(
        p5,
        map,
        cols,
        rows
      );
      seekAndDestroyObjects.target = createMaze(
        map,
        cols,
        rows,
        targetStartPos,
        targetEndPos
      );

      const attackerStartPos: IPosition = getRandomPositionFromCell(
        p5,
        map,
        cols,
        rows
      );
      seekAndDestroyObjects.attacker = createMaze(
        map,
        cols,
        rows,
        attackerStartPos,
        targetStartPos
      );

      paths[0] = [];
      paths[1] = [];      
    },
    draw: () => {
      let lastTargetPosition: IPosition = undefined;
      if (seekAndDestroyObjects.target.path.length > 0) {
        lastTargetPosition = seekAndDestroyObjects.target.path.pop()!;
        paths[0].push(lastTargetPosition);
      }
      if (seekAndDestroyObjects.attacker.path.length > 0) {
        const lastAttackerPosition = seekAndDestroyObjects.attacker.path.pop()!;
        paths[1].push(lastAttackerPosition);
      }
      if (seekAndDestroyObjects.attacker.path.length > 0) {
        const lastAttackerPosition = seekAndDestroyObjects.attacker.path.pop()!;
        paths[1].push(lastAttackerPosition);
      }

      p5.background(155);
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const isWall = map[col]![row];
          if (isWall) drawWall(p5, { col, row }, cellWidth, cellHeight);
          else drawCell(p5, { col, row }, cellWidth, cellHeight);
        }
      }
      for (const path of paths) {
        drawPath(p5, path, cellWidth, cellHeight);
      }

      drawIndicator(
        p5,
        seekAndDestroyObjects.attacker!.startPos,
        true,
        cellWidth,
        cellHeight,
        p5.color(255, 0, 0)
      );
      drawIndicator(
        p5,
        seekAndDestroyObjects.attacker!.endPos,
        false,
        cellWidth,
        cellHeight,
        p5.color(255, 0, 0)
      );

      drawIndicator(
        p5,
        seekAndDestroyObjects.target!.startPos,
        true,
        cellWidth,
        cellHeight,
        p5.color(0, 255, 0)
      );
      drawIndicator(
        p5,
        seekAndDestroyObjects.target!.endPos,
        false,
        cellWidth,
        cellHeight,
        p5.color(0, 255, 0)
      );

      if (
        seekAndDestroyObjects.target.path.length <= 0 &&
        seekAndDestroyObjects.attacker.path.length <= 0
      ) {
        p5.noLoop();
        console.log("Draw.");
        return;
      }
      if (seekAndDestroyObjects.target.path.length <= 0) {
        p5.noLoop();
        console.log("target win.");
        return;
      }
      if (seekAndDestroyObjects.attacker.path.length <= 0) {
        p5.noLoop();
        console.log("attacker win.");
        return;
      }

      if (
        lastTargetPosition &&
        seekAndDestroyObjects.attacker.path.length > 0
      ) {
        const result = finPathByAStartAlg({
          map,
          cols,
          rows,
          start:
            seekAndDestroyObjects.attacker.path[
              seekAndDestroyObjects.attacker?.path.length - 1
            ],
          end: lastTargetPosition,
        });
        const path = result.path.map((p) => ({
          col: p.element.col,
          row: p.element.row,
        }));

        seekAndDestroyObjects.attacker.path = path;
      }
    },
  };
};
