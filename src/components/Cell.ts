import { ICellElement, ICellPathFinderData } from "../pathfinder";
import { IGridElement, Position } from "./interfaces";

export const mapPositiontoIndex = (
  pos: IGridElement,
  cols: number,
  rows: number
) => {
  return (pos.row % rows) + pos.col * cols;
};

type AdjecentCell = {
  cell: ICellPathFinderData | undefined;
  element: IGridElement;
};

const getAdjacentCellPositions = (
  element: ICellElement,
  cols: number,
  rows: number
): IGridElement[] => {
  const adjecentPositions: IGridElement[] = [];
  if (element.row > 0) {
    const topMiddle: IGridElement = {
      col: element.col,
      row: element.row - 1,
      position: Position.TopMiddle,
    };
    adjecentPositions.push(topMiddle);
  }
  if (element.col < cols - 1 && element.row > 0) {
    const topRight: IGridElement = {
      col: element.col + 1,
      row: element.row - 1,
      position: Position.TopRight,
    };
    adjecentPositions.push(topRight);
  }
  if (element.col < cols - 1) {
    const centerRight: IGridElement = {
      col: element.col + 1,
      row: element.row,
      position: Position.CenterRight,
    };
    adjecentPositions.push(centerRight);
  }
  if (element.col < cols - 1 && element.row < rows - 1) {
    const bottomRight: IGridElement = {
      col: element.col + 1,
      row: element.row + 1,
      position: Position.BottomRight,
    };
    adjecentPositions.push(bottomRight);
  }
  if (element.row < rows - 1) {
    const bottomMiddle: IGridElement = {
      col: element.col,
      row: element.row + 1,
      position: Position.BottomMiddle,
    };
    adjecentPositions.push(bottomMiddle);
  }
  if (element.col > 0 && element.row < rows - 1) {
    const bottomLeft: IGridElement = {
      col: element.col - 1,
      row: element.row + 1,
      position: Position.BottomLeft,
    };
    adjecentPositions.push(bottomLeft);
  }
  if (element.col > 0) {
    const centerLeft: IGridElement = {
      col: element.col - 1,
      row: element.row,
      position: Position.CenterLeft,
    };
    adjecentPositions.push(centerLeft);
  }
  if (element.col > 0 && element.row > 0) {
    const topLeft: IGridElement = {
      col: element.col - 1,
      row: element.row - 1,
      position: Position.TopLeft,
    };
    adjecentPositions.push(topLeft);
  }
  return adjecentPositions;
};

const isBlock = (
  cells: AdjecentCell[],
  orientationA: Position,
  orientationB: Position
) => {
  const cellA = cells.find((c) => c.element.position === orientationA);
  const cellB = cells.find((c) => c.element.position === orientationB);
  return !cellA?.cell && !cellB?.cell;
};

const getPositionBlockers = ({
  element: { position: orientation },
}: AdjecentCell) => {
  switch (orientation) {
    case Position.TopLeft:
      return [Position.TopMiddle, Position.CenterLeft];
    case Position.TopRight:
      return [Position.TopMiddle, Position.CenterRight];
    case Position.BottomRight:
      return [Position.CenterRight, Position.BottomMiddle];
    case Position.BottomLeft:
      return [Position.BottomMiddle, Position.CenterLeft];
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
    adjectentCells.push({ cell: adjecentCell, element: position });
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

      const nonBlockedCells = adjecentCells.filter((adjecentCell) => {
        if (!adjecentCell.cell) {
          return false;
        }
        const blockerPositions = getPositionBlockers(adjecentCell);
        const isBlocked =
          blockerPositions.length > 0 &&
          isBlock(adjecentCells, blockerPositions[0]!, blockerPositions[1]!);
        return !isBlocked;
      });

      for (const neighborCell of nonBlockedCells) {
        cell.neighbors.push(neighborCell.cell!);
      }
    }
  }
};
