export function getRandomNumber(min: number, max: number, numAfterDigit = 0) {
  return Number(((Math.random() * (max - min)) + min).toFixed(numAfterDigit));
}

export function getRandomItem<T>(items: T[]) : T {
  return items[getRandomNumber(0, items.length-1)];
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = getRandomNumber(0, items.length - 1);
  const endPosition = startPosition + getRandomNumber(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}
