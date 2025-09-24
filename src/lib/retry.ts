const COUNT = 3;

export const retryWithDelay = async <T>(
  fn: () => Promise<T>,
  count = COUNT,
  delay = 1000,
): Promise<T> => {
  let lastError: Error;
  for (let i = count; i > 0; i--) {
    try {
      const res = await fn();
      return res
    } catch (error) {
      lastError = error as Error;
      if (error instanceof Error && error.message.includes('429')) {
        const backoffDelay = delay * 2 ** i;
        console.log(`请求被限流，等待 ${backoffDelay}ms 后重试...`);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      } else if (i < count - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError!;
};
