import { Grid } from "./components/Grid";
import P5 from "p5";

export const Sketch = (p5: P5) => {
  const rows = 50;
  const cols = 50;
  const wallPerct = 0.354;
  const startIndexes = {
    col: Math.trunc(p5.random(0, cols - 1)),
    row: Math.trunc(p5.random(0, rows - 1)),
  };
  const endIndexes = {
    col: Math.trunc(p5.random(0, cols - 1)),
    row: Math.trunc(p5.random(0, rows - 1)),
  };
  const grid = Grid(p5, cols, rows,startIndexes, endIndexes, wallPerct, () => ({
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
