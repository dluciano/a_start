import { AAsteriskData, IDrawerObject } from "./interfaces";

import p5 from "p5";

export class Cell implements IDrawerObject {
  constructor(
    public readonly col: number,
    public readonly row: number,
    public readonly width: number,
    public readonly height: number,
    public color: p5.Color,
    public readonly data: AAsteriskData,
    public readonly neighbors: Cell[],   
    public previous: Cell | undefined, 
    public wall: boolean = false
  ) {
  }
}
