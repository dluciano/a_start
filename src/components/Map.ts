export const createRandomMap = (
  cols: number,
  rows: number,
  wallPercentage: number
): boolean[][] => {
  const map: boolean[][] = Array(cols);
  for (let col = 0; col < cols; col++) {
    map[col] = Array(rows);
    for (let row = 0; row < rows; row++) {
      map[col]![row] = Math.random() < wallPercentage;
    }
  }
  return map;
};
