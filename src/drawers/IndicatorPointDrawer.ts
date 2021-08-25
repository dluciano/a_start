import { IPosition } from "components/interfaces";
import p5 from "p5";

export const drawIndicator = (
  p5: p5,
  position: IPosition,
  isStart: boolean,
  width: number,
  height: number,
  color: p5.Color
) => {
  if (isStart) p5.fill(p5.color(0, 0, 0));
  else p5.fill(p5.color(255, 255, 255));
  p5.strokeWeight(2);
  p5.stroke(color);
  p5.rect(position.col * width, position.row * height, width, height);
};
