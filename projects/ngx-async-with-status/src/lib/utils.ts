type IOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): IOmit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

export function forEachObject<T>(obj: Record<string, T>, callback: (value: T, key: string, obj: Record<string, T>) => void): void {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      callback(obj[key], key, obj);
    }
  }
}
