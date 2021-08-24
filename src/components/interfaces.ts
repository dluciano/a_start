import { ICellElement, ICellPathFinderData } from "../pathfinder";

export interface IDrawerObject {}

export interface IWall extends IDrawerObject, ICellElement {}

export enum CellType {
  None = 0,
  OpenSet = 1,
  CloseSet = 2,
  Target = 3,
}

export enum Position {
  TopMiddle,
  TopRight,
  CenterRight,
  BottomRight,
  BottomMiddle,
  BottomLeft,
  CenterLeft,
  TopLeft,  
}
export interface IGridElement {
  col: number;
  row: number;
  position: Position;
}
export interface ICell extends IDrawerObject, ICellElement {
  data?: ICellPathFinderData;
  // highlight?: boolean;
  // masterHightlight?: boolean;
  types: CellType;
}

export interface IDrawable {
  draw?: () => void;
}

export interface ISetupable {
  setup?: () => void;
}

export interface IRenderable extends IDrawable, ISetupable {}

export interface ISize {
  width: number;
  height: number;
}
