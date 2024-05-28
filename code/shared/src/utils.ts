export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function waitUntil(predicate: () => boolean, max = Number.POSITIVE_INFINITY): Promise<boolean> {
  const now = Date.now();

  while (!predicate() && Date.now() - now < max) {
    await sleep(10);
  }

  return predicate();
}
