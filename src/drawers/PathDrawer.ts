import { IPosition } from "components/interfaces";
import p5 from "p5";

export const drawPath = (
  p5: p5,
  objects: IPosition[],
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
};
