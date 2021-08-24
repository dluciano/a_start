import { ElementOrientation, IGridPosition } from "./interfaces";
import { ICellElement, ICellPathFinderData } from "../pathfinder";

export const mapPositiontoIndex = (
  pos: IGridPosition,
  cols: number,
  rows: number
) => {
  return (pos.row % rows) + pos.col * cols;
};

type AdjecentCell = {
  cell: ICellPathFinderData | undefined;
  position: IGridPosition;
};

const getAdjacentCellPositions = (
  element: ICellElement,
  cols: number,
  rows: number
): IGridPosition[] => {
  const adjecentPositions: IGridPosition[] = [];
  if (element.row > 0) {
    const topMiddle: IGridPosition = {
      col: element.col,
      row: element.row - 1,
      orientation: ElementOrientation.TopMiddle,
    };
    adjecentPositions.push(topMiddle);
  }
  if (element.col < cols - 1 && element.row > 0) {
    const topRight: IGridPosition = {
      col: element.col + 1,
      row: element.row - 1,
      orientation: ElementOrientation.TopRight,
    };
    adjecentPositions.push(topRight);
  }
  if (element.col < cols - 1) {
    const centerRight: IGridPosition = {
      col: element.col + 1,
      row: element.row,
      orientation: ElementOrientation.CenterRight,
    };
    adjecentPositions.push(centerRight);
  }
  if (element.col < cols - 1 && element.row < rows - 1) {
    const bottomRight: IGridPosition = {
      col: element.col + 1,
      row: element.row + 1,
      orientation: ElementOrientation.BottomRight,
    };
    adjecentPositions.push(bottomRight);
  }
  if (element.row < rows - 1) {
    const bottomMiddle: IGridPosition = {
      col: element.col,
      row: element.row + 1,
      orientation: ElementOrientation.BottomMiddle,
    };
    adjecentPositions.push(bottomMiddle);
  }
  if (element.col > 0 && element.row < rows - 1) {
    const bottomLeft: IGridPosition = {
      col: element.col - 1,
      row: element.row + 1,
      orientation: ElementOrientation.BottomLeft,
    };
    adjecentPositions.push(bottomLeft);
  }
  if (element.col > 0) {
    const centerLeft: IGridPosition = {
      col: element.col - 1,
      row: element.row,
      orientation: ElementOrientation.CenterLeft,
    };
    adjecentPositions.push(centerLeft);
  }
  if (element.col > 0 && element.row > 0) {
    const topLeft: IGridPosition = {
      col: element.col - 1,
      row: element.row - 1,
      orientation: ElementOrientation.TopLeft,
    };
    adjecentPositions.push(topLeft);
  }
  return adjecentPositions;
};

const isBlock = (
  neighbors: AdjecentCell[],
  a: ElementOrientation,
  b: ElementOrientation
) => {
  const aPos = neighbors.find((c) => c.position.orientation === a);
  const bPos = neighbors.find((c) => c.position.orientation === b);
  return !aPos?.cell && !bPos?.cell;
};

const getPositionBlockers = ({ position: { orientation } }: AdjecentCell) => {
  switch (orientation) {
    case ElementOrientation.TopLeft:
      return [ElementOrientation.TopMiddle, ElementOrientation.CenterLeft];
    case ElementOrientation.TopRight:
      return [ElementOrientation.TopMiddle, ElementOrientation.CenterRight];
    case ElementOrientation.BottomRight:
      return [ElementOrientation.CenterRight, ElementOrientation.BottomMiddle];
    case ElementOrientation.BottomLeft:
      return [ElementOrientation.BottomMiddle, ElementOrientation.CenterLeft];
    default:
      return [];
  }
};

const getAdjecentCells = (
  cols: number,
  rows: number,
  cells: ICellPathFinderData[][],
  { element }: ICellPathFinderData
): AdjecentCell[] => {
  const positions = getAdjacentCellPositions(element, cols, rows);
  const adjectentCells: AdjecentCell[] = [];

  for (const position of positions) {
    const adjecentCell = cells[position.col]![position.row];
    adjectentCells.push({ cell: adjecentCell, position });
  }

  return adjectentCells;
};

export const setNeighbors = (
  cols: number,
  rows: number,
  cells: ICellPathFinderData[][]
) => {
  for (let col = 0; col < cells.length; col++) {
    const rowCells = cells[col]!;
    for (let row = 0; row < rowCells.length; row++) {
      const cell = rowCells[row]!;
      if (!cell || !cell.element) continue;

      const adjecentCells: AdjecentCell[] = getAdjecentCells(
        cols,
        rows,
        cells,
        cell
      );

      for (const adjecentCell of adjecentCells) {
        const blockerPositions = getPositionBlockers(adjecentCell);
        if (blockerPositions && blockerPositions.length > 0)
          isBlock(adjecentCells, blockerPositions[0]!, blockerPositions[1]!);
        cell.neighbors.push(adjecentCell.cell!);
      }
    }
  }
};
