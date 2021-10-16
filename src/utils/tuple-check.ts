export function isTuple<T>(arr: T[]): arr is [T, T] {
  return Array.isArray(arr) && arr.length === 2 && arr[0] !== undefined && arr[1] !== undefined;
}