import { ElementOrientation, IGridPosition } from "./interfaces";
import { ICellElement, ICellPathFinderData } from "../pathfinder";

export const mapPositiontoIndex = (
  pos: IGridPosition,
  cols: number,
  rows: number
) => {
  return (pos.row % rows) + pos.col * cols;
};

type Neighbor = {
  neighbor: ICellPathFinderData | undefined;
  position: IGridPosition;
};

function* getAdjacentCellPositionsIterator(
  element: ICellElement,
  cols: number,
  rows: number
) {
  if (element.row > 0) {
    const topMiddle: IGridPosition = {
      col: element.col,
      row: element.row - 1,
      orientation: ElementOrientation.TopMiddle,
    };
    yield topMiddle;
  }
  if (element.col < cols - 1 && element.row > 0) {
    const topRight: IGridPosition = {
      col: element.col + 1,
      row: element.row - 1,
      orientation: ElementOrientation.TopRight,
    };
    yield topRight;
  }
  if (element.col < cols - 1) {
    const centerRight: IGridPosition = {
      col: element.col + 1,
      row: element.row,
      orientation: ElementOrientation.CenterRight,
    };
    yield centerRight;
  }
  if (element.col < cols - 1 && element.row < rows - 1) {
    const bottomRight: IGridPosition = {
      col: element.col + 1,
      row: element.row + 1,
      orientation: ElementOrientation.BottomRight,
    };
    yield bottomRight;
  }
  if (element.row < rows - 1) {
    const bottomMiddle: IGridPosition = {
      col: element.col,
      row: element.row + 1,
      orientation: ElementOrientation.BottomMiddle,
    };
    yield bottomMiddle;
  }
  if (element.col > 0 && element.row < rows - 1) {
    const bottomLeft: IGridPosition = {
      col: element.col - 1,
      row: element.row + 1,
      orientation: ElementOrientation.BottomLeft,
    };
    yield bottomLeft;
  }
  if (element.col > 0) {
    const centerLeft: IGridPosition = {
      col: element.col - 1,
      row: element.row,
      orientation: ElementOrientation.CenterLeft,
    };
    yield centerLeft;
  }
  if (element.col > 0 && element.row > 0) {
    const topLeft: IGridPosition = {
      col: element.col - 1,
      row: element.row - 1,
      orientation: ElementOrientation.TopLeft,
    };
    yield topLeft;
  }
}

const isBlock = (
  neighbors: Neighbor[],
  a: ElementOrientation,
  b: ElementOrientation
) => {
  const aPos = neighbors.find((c) => c.position.orientation === a);
  const bPos = neighbors.find((c) => c.position.orientation === b);
  if (!aPos?.neighbor && !bPos?.neighbor) return true;
  return false;
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

      const positions = getAdjacentCellPositionsIterator(cell.element, cols, rows);
      let current = positions.next();
      const neighbors: Neighbor[] = [];
      // const isH = cell.element.col === 2 && cell.element.row == 2;
      // if (isH) cell.element.masterHightlight = true;

      while (!current.done) {
        const position = current.value;
        const neighbor = cells[position.col]![position.row];
        neighbors.push({ neighbor, position });
        // if (isH) neighbor.element!.highlight = true;
        cell.neighbors.push(neighbor!);
        current = positions.next();
      }

      for (const item of neighbors) {
        const neighbor = item.neighbor;
        if (!neighbors) continue;

        if (item.position.orientation === ElementOrientation.TopLeft) {
          const isBlocked = isBlock(neighbors,
            ElementOrientation.TopMiddle,
            ElementOrientation.CenterLeft
          );
          if (isBlocked) continue;
        }
        if (item.position.orientation === ElementOrientation.TopRight) {
          const isBlocked = isBlock(
            neighbors,
            ElementOrientation.TopMiddle,
            ElementOrientation.CenterRight
          );
          if (isBlocked) continue;
        }
        if (item.position.orientation === ElementOrientation.BottomRight) {
          const isBlocked = isBlock(
            neighbors,
            ElementOrientation.CenterRight,
            ElementOrientation.BottomMiddle
          );
          if (isBlocked) continue;
        }
        if (item.position.orientation === ElementOrientation.BottomLeft) {
          const isBlocked = isBlock(
            neighbors,
            ElementOrientation.BottomMiddle,
            ElementOrientation.CenterLeft
          );
          if (isBlocked) continue;
        }
        if (neighbor) {
          cell.neighbors.push(neighbor!);
        }
      }
    }
  }
};
