import { Grid } from "./components/Grid";
import P5 from "p5";

export const Sketch = (p5: P5) => {
  const rows = 25;
  const cols = 25;
  const wallPerct = 0.2;

  const startColIndex = Math.trunc(p5.random(0, cols - 1));
  const startRowIndex = Math.trunc(p5.random(0, rows - 1));
  const endColIndex = Math.trunc(p5.random(0, cols - 1));
  const endRowIndex = Math.trunc(p5.random(0, rows - 1));

  const grid = Grid(
    p5,
    cols,
    rows,
    { startColIndex, startRowIndex, endColIndex, endRowIndex },
    wallPerct,
    () => ({
      width: p5.width,
      height: p5.height,
    })
  );

  p5.setup = () => {
    p5.createCanvas(700, 700);
    p5.background("white");
    grid.setup?.();
  };

  p5.draw = () => {
    grid.draw?.();
  };
};
