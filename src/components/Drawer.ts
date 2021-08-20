import { Cell } from "./Cell";
import { IDrawerObject } from "./interfaces";
import p5 from "p5";

export const Drawer = (p5: p5) => {
  return {
    draw: (object?: IDrawerObject) => {
      if (!object) return;
      if (object instanceof Cell) {
        p5.fill(object.color);
        p5.stroke(256);
        p5.rect(
          object.row * object.width,
          object.col * object.height,
          object.width,
          object.height
        );
      }
    },
    drawLine: (objects: IDrawerObject[]) => {
      if (objects.length <= 0) return;
      p5.noFill();
      p5.stroke(p5.color(22, 127, 128));
      p5.strokeWeight(3);
      p5.beginShape();
      for (let i = 0; i < objects.length; i++) {
        const cell = objects[i]!;
        if (cell instanceof Cell) {
          p5.vertex(
            cell.row * cell.width + cell.width / 2,
            cell.col * cell.height + cell.height / 2
          );
        }
      }
      p5.endShape();
    },
  };
};
