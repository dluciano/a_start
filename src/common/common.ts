export const removeFromArray = <T>(arr: Array<T>, element: T) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == element) {
      arr.splice(i, 1);
    }
  }
};

export const mapIndexToPosition = (index: number, col: number, row: number) => {
  return { col: Math.trunc(index / col), row: Math.trunc(index % row) };
};
