export const euclideanDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

export const taxyCabDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

export const removeFromArray = <T>(arr: Array<T>, element: T) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == element) {
      arr.splice(i, 1);
    }
  }
};
