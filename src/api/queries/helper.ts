/**
 * Wraps an SDK module so all methods return only the `data` property.
 * This avoids having to write `.data` on every API call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SdkFunction = (...args: any[]) => Promise<{ data?: unknown }>;

export function unwrapSdk<T extends Record<string, SdkFunction>>(
  sdk: T,
): { [K in keyof T]: (...args: Parameters<T[K]>) => Promise<NonNullable<Awaited<ReturnType<T[K]>>['data']>> } {
  return new Proxy(sdk, {
    get(target, prop) {
      const original = target[prop as keyof T];
      if (typeof original === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return async (...args: any[]) => {
          const result = await original(...args);
          return result.data;
        };
      }
      return original;
    },
  }) as { [K in keyof T]: (...args: Parameters<T[K]>) => Promise<NonNullable<Awaited<ReturnType<T[K]>>['data']>> };
}
