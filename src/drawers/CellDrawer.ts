import { IPosition } from "components/interfaces";
import p5 from "p5";

export const drawCell = (
  p5: p5,
  position: IPosition,
  width: number,
  height: number
) => {
  p5.fill(p5.color(98, 94, 13));
  p5.strokeWeight(0);  
  p5.rect(position.col * width, position.row * height, width, height);
};
