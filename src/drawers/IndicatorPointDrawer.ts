import { IPosition } from "components/interfaces";
import p5 from "p5";

export const drawIndicator = (
  p5: p5,
  position: IPosition,
  isStart: boolean,
  width: number,
  height: number
) => {
  if (isStart) p5.fill(p5.color(123, 0, 0));
  else p5.fill(p5.color(0, 200, 54));
  p5.strokeWeight(0);
  p5.stroke(0);
  p5.rect(position.col * width, position.row * height, width, height);
};
