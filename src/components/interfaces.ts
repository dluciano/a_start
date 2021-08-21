export interface IDrawerObject {}

export interface ICellElement {
  readonly row: number;
  readonly col: number;
}

export interface IWall extends IDrawerObject, ICellElement {}

export enum CellType {
  None = 0,
  OpenSet = 1,
  CloseSet = 2,
  Target = 3
}
export interface IGridPosition {
  col: number;
  row: number;
}
export interface ICell extends IDrawerObject, ICellElement {
  data: ICellPathFinderData;
  // highlight?: boolean;
  // masterHightlight?: boolean;
  types: CellType
}

export interface IDrawable {
  draw?: () => void;
}

export interface ICellPathFinderData {
  f: number;
  g: number;
  h: number;
  neighbors: ICellPathFinderData[];
  previous?: ICellPathFinderData;
  getDistance: (to: ICellElement) => number;
  element?: ICell
}

export interface ISetupable {
  setup?: () => void;
}

export interface IRenderable extends IDrawable, ISetupable {}

export interface ISize {
  width: number;
  height: number;
}
