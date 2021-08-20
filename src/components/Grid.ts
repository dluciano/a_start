import { IRenderable, ISize } from "./interfaces";

import { Cell } from "./Cell";
import { Drawer } from "./Drawer";
import p5 from "p5";

export const Grid = (
  p5: p5,
  cols: number,
  rows: number,
  wallPercentage: number,
  canvasSize: () => ISize
): IRenderable => {
  const removeFromArray = <T>(arr: Array<T>, element: any) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == element) {
        arr.splice(i, 1);
      }
    }
  };
  const heuristic = (a: Cell, b: Cell) => {
    //const distance = Math.abs(a.col - b.col) + Math.abs(a.row - b.row); // Taxy cab distance. Square steps
    const distance = p5.dist(a.col, a.row, b.col, b.row);
    return distance;
  };
  const cells: Cell[][] = Array<Array<Cell>>(rows);
  const openSet: Cell[] = [];
  const closeSet: Cell[] = [];
  let path: Cell[] = [];
  let start: Cell | undefined;
  let end: Cell | undefined;
  const drawer = Drawer(p5);
  return {
    setup: () => {
      const { width: canvasWidth, height: canvasHeight } = canvasSize();

      for (let i = 0; i < cols; i++) {
        cells[i] = new Array<Cell>(cols);
        for (let j = 0; j < rows; j++) {
          const isWall = Math.random() < wallPercentage;

          cells[i]![j] = new Cell(
            i,
            j,
            canvasWidth / cols,
            canvasHeight / rows,
            isWall ? p5.color(0) : p5.color(256),
            { f: 0, g: 0, h: 0 },
            [],
            undefined,
            isWall
          );
        }
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const neighbors = cells[i]![j]!.neighbors;
          if (i < cols - 1) {
            neighbors.push(cells[i + 1]![j]!);
          }
          if (i > 0) {
            neighbors.push(cells[i - 1]![j]!);
          }
          if (j < rows - 1) {
            neighbors.push(cells[i]![j + 1]!);
          }
          if (j > 0) {
            neighbors.push(cells[i]![j - 1]!);
          }
          // Diagonals neighbors
          if (i > 0 && j > 0) {
            neighbors.push(cells[i - 1]![j - 1]!);
          }
          if (i > cols - 1 && j > 0) {
            neighbors.push(cells[i + 1]![j - 1]!);
          }
          if (i > 0 && j < rows - 1) {
            neighbors.push(cells[i - 1]![j + 1]!);
          }
          if (i < cols - 1 && j < rows - 1) {
            neighbors.push(cells[i + 1]![j + 1]!);
          }
        }
      }
      start = cells[0]![0]!;
      start.wall = false;
      end =
        cells[Math.trunc(p5.random(0, cols - 1))]![
          Math.trunc(p5.random(0, rows - 1))
        ]!;
      //   end = cells[cols - 5]![rows - 5]!;
      end.wall = false;
      openSet.push(start!);
    },
    draw: () => {
      if (openSet.length > 0) {
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
          const cell = openSet[i]!;
          const winnerCell = openSet[winner]!;
          if (cell.data.f < winnerCell.data.f) {
            winner = i;
          }
        }
        const current = openSet[winner]!;
        if (current == end) {
          p5.noLoop();
        }
        path = [];
        let tmp = current;
        path.push(tmp);
        while (tmp.previous) {
          path.push(tmp.previous);
          tmp = tmp.previous;
        }
        removeFromArray(openSet, current);
        closeSet.push(current);
        const neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
          const neighbor = neighbors[i]!;
          if (!neighbor.wall && !closeSet.includes(neighbor)) {
            const tentative_gScore = current.data.g + 1;
            let newPath = false;
            if (openSet.includes(neighbor)) {
              if (tentative_gScore < neighbor.data.g) {
                neighbor.data.g = tentative_gScore;
                newPath = true;
              }
            } else {
              neighbor.data.g = tentative_gScore;
              newPath = true;
              openSet.push(neighbor);
            }
            if (newPath) {
              neighbor.data.h = heuristic(neighbor, end!);
              neighbor.data.f = neighbor.data.g + neighbor.data.h;
              neighbor.previous = current;
            }
          }
        }
      } else {
        p5.noLoop();
        return;
      }
      p5.background(0);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const cell = cells[i]![j]!;
          drawer.draw(cell);
        }
      }
      for (let i = 0; i < closeSet.length; i++) {
        const cell = closeSet[i]!;
        if (cell == end) continue;
        cell.color = p5.color(255, 0, 0);
        drawer.draw(cell);
      }

      for (let i = 0; i < openSet.length; i++) {
        const cell = openSet[i]!;
        if (cell == end) continue;
        cell.color = p5.color(0, 255, 0);
        drawer.draw(cell);
      }

      drawer.drawLine(path);

      end!.color = p5.color(123, 0, 123);
    },
  };
};
