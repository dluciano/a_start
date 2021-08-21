import { ICellElement, ICellPathFinderData, IGridPosition } from "./interfaces";

import p5 from "p5";

export const mapPositiontoIndex = (
  pos: IGridPosition,
  cols: number,
  rows: number
) => {
  return (pos.row % rows) + pos.col * cols;
};

function* getNeighbors(element: ICellElement, cols: number, rows: number) {
  if (element.row > 0) {
    const topMiddle: IGridPosition = {
      col: element.col,
      row: element.row - 1,
    };
    yield topMiddle;
  }
  if (element.col < cols - 1 && element.row > 0) {
    const topRight: IGridPosition = {
      col: element.col + 1,
      row: element.row - 1,
    };
    yield topRight;
  }
  if (element.col < cols - 1) {
    const centerRight: IGridPosition = {
      col: element.col + 1,
      row: element.row,
    };
    yield centerRight;
  }
  if (element.col < cols - 1 && element.row < rows - 1) {
    const bottomRight: IGridPosition = {
      col: element.col + 1,
      row: element.row + 1,
    };
    yield bottomRight;
  }
  if (element.row < rows - 1) {
    const bottomMiddle: IGridPosition = {
      col: element.col,
      row: element.row + 1,
    };
    yield bottomMiddle;
  }
  if (element.col > 0 && element.row < rows - 1) {
    const bottomLeft: IGridPosition = {
      col: element.col - 1,
      row: element.row + 1,
    };
    yield bottomLeft;
  }
  if (element.col > 0) {
    const centerLeft: IGridPosition = {
      col: element.col - 1,
      row: element.row,
    };
    yield centerLeft;
  }
  if (element.col > 0 && element.row > 0) {
    const topLeft: IGridPosition = {
      col: element.col - 1,
      row: element.row - 1,
    };
    yield topLeft;
  }
}

export const setNeighbors = (
  cols: number,
  rows: number,
  cells: ICellPathFinderData[][]
) => {
  for (let col = 0; col < cells.length; col++) {
    const rowCells = cells[col]!;
    for (let row = 0; row < rowCells.length; row++) {
      const cell = rowCells[row]!;
      if(!cell) continue;
      if (!cell.element) continue;

      const positions = getNeighbors(cell.element, cols, rows);
      let current = positions.next();     
      // const isH = cell.element.col === 2 && cell.element.row == 2;
      // if (isH) cell.element.masterHightlight = true;
      while (!current.done) {
        const position = current.value;        
        const neighbor = cells[position.col]![position.row];
        if (!neighbor) {
          current = positions.next();
          continue;
        }
        // if (isH) neighbor.element!.highlight = true;
        cell.neighbors.push(neighbor!);
        current = positions.next();
      }
    }
  }
};

export const removeFromArray = <T>(arr: Array<T>, element: any) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == element) {
      arr.splice(i, 1);
    }
  }
};

export const euclideanDistance = (
  p5: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => p5.dist(x1, y1, x2, y2);

export const taxyCabDistance = (a: ICellElement, b: ICellElement) =>
  Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
