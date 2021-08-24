import { Grid } from "./components/Grid";
import P5 from "p5";

export const Sketch = (p5: P5) => {
  const rows = 75;
  const cols = rows;
  const wallPerct = 0.324;

  const grid = Grid(p5, cols, rows, wallPerct, () => ({
    width: p5.width,
    height: p5.height,
  }));

  p5.setup = () => {
    p5.createCanvas(700, 700);
    p5.background("white");
    grid.setup?.();
  };

  p5.draw = () => {
    grid.draw?.();
  };
};
