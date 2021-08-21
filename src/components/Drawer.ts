import { CellType, ICell, ICellElement, IWall } from "./interfaces";

import { mapPositiontoIndex } from "./Cell";
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
            p5.fill(p5.color(255));
            break;
        }
        // if (cell.highlight && !cell.masterHightlight) {
        //   p5.stroke(p5.color(255, 0, 0));
        //   p5.strokeWeight(10);
        // } else if (cell.masterHightlight) {
        //   p5.stroke(p5.color(0, 0, 255));
        //   p5.strokeWeight(10);
        // } else {
        //   p5.stroke(100);
        //   p5.strokeWeight(1);
        // }

        p5.stroke(100);
          p5.strokeWeight(1);

        p5.rect(cell.col * width, cell.row * height, width, height);

        // p5.stroke(100);
        // p5.strokeWeight(1);
        // p5.stroke(p5.color(255, 0, 0));
        // p5.fill(p5.color(255, 0, 0));
        // p5.textSize(12);
        // p5.text(
        //   `${cell.col}, ${cell.row}`,
        //   cell.col * width + 3,
        //   cell.row * height + 15
        // );
        // p5.text(
        //   `${mapPositiontoIndex({ col: cell.col, row: cell.row }, 5, 5)}`,
        //   cell.col * width + width / 2,
        //   cell.row * height + height / 2 - 10
        // );
      }
    },
    drawWalls: (p5: p5, walls: IWall[], width: number, height: number) => {
      for (const wall of walls) {
        p5.fill(0);        
        p5.rect(wall.col * width, wall.row * height, width, height);
        
        // p5.fill(255);
        // p5.stroke(255);
        // p5.textSize(12);
        // p5.text(
        //   `W`,
        //   wall.col * width + width / 2,
        //   wall.row * height + height / 2
        // );
      }
    },
    drawPath: (
      p5: p5,
      objects: ICellElement[],
      width: number,
      height: number
    ) => {
      if (objects.length <= 0) return;
      p5.noFill();
      p5.stroke(p5.color(22, 127, 128));
      p5.strokeWeight(3);
      p5.beginShape();
      for (const cell of objects) {
        p5.vertex(cell.col * width + width / 2, cell.row * height + height / 2);
      }
      p5.endShape();

      let i = objects.length;
      p5.fill(0);
      p5.stroke(0);
      p5.strokeWeight(1);
      for (const cell of objects) {
        p5.textSize(12);
        p5.text(
          `${i}`,
          cell.col * width + width / 2,
          cell.row * height + height / 2 + 10
        );
        i--;
      }
    },
  };
};
