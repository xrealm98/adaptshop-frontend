export function calculateVisiblePages(current: number, total: number, max: number = 5): number[] {
  if (total <= 0) return [];
  let start = Math.max(1, current - Math.floor(max / 2));
  let end = Math.min(total, start + max - 1);

  if (end - start + 1 < max) {
    start = Math.max(1, end - max + 1);
  }

  start = Math.max(1, start);

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}
