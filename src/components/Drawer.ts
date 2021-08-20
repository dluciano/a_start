import { CellType, ICell, ICellElement, IWall } from "./interfaces";

import p5 from "p5";

export const Drawer = () => {
  return {
    drawCells: (p5: p5, cells: ICell[], width: number, height: number) => {
      for (const cell of cells) {
        switch (cell.types) {
          case CellType.Target:
            p5.fill(p5.color(123, 0, 123));
            break;
          case CellType.CloseSet:
            p5.fill(p5.color(256, 0, 0));
            break;
          case CellType.OpenSet:
            p5.fill(p5.color(0, 255, 0));
            break;
          default:
            p5.fill(255);
            break;
        }
        p5.stroke(255);
        p5.strokeWeight(2);
        p5.rect(cell.col * width, cell.row * height, width, height);
      }
    },
    drawWalls: (p5: p5, walls: IWall[], width: number, height: number) => {
      for (const wall of walls) {
        p5.fill(0);
        p5.stroke(256);
        p5.strokeWeight(2);
        p5.rect(wall.col * width, wall.row * height, width, height);
      }
    },
    drawPath: (p5: p5, objects: ICellElement[], width: number, height: number) => {
      if (objects.length <= 0) return;
      p5.noFill();
      p5.stroke(p5.color(22, 127, 128));
      p5.strokeWeight(3);
      p5.beginShape();
      for (const cell of objects) {
        p5.vertex(cell.col * width + width / 2, cell.row * height + height / 2);
      }
      p5.endShape();
    },
  };
};
