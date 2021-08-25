import { IPosition } from "components/interfaces";
import p5 from "p5";

export const drawWall = (
  p5: p5,
  position: IPosition,
  width: number,
  height: number
) => {
  p5.fill(0);
  p5.strokeWeight(0);
  p5.stroke(0);
  p5.rect(position.col * width, position.row * height, width, height);
};
