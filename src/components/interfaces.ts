export interface IPosition {
  col: number;
  row: number;
}

type CellDrawableType = {
  type: "CellDrawableType";
  element: IPosition;
};

type WallDrawableType = {
  type: "WallDrawableType";
  element: IPosition;
};

type PathDrawableType = {
  type: "PathDrawableType";
  element: IPosition;
};

export type IDrawableType =
  | CellDrawableType
  | WallDrawableType
  | PathDrawableType;