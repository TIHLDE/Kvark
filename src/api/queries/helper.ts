/**
 * Extract query parameters from a generated SDK Data type.
 * Usage: QueryParams<ListEventsData> -> { expired?: boolean; ... }
 */
export type QueryParams<T> = T extends { query?: infer Q } ? Q : never;

/**
 * Extract path parameters from a generated SDK Data type.
 * Usage: PathParams<GetEventData> -> { eventId: string }
 */
export type PathParams<T> = T extends { path?: infer P } ? P : never;

/**
 * Extract payload type (from body) for mutations
 * Usage: Payload<CreateEventData> -> { title: string, ... }
 */
export type Payload<T> = T extends { body?: infer P } ? P : never;

/**
 * Extract the returned data from a responses type given the status code.
 * Usage: RequestReturnType<GetEventResponses, 200> -> EventData
 */
export type RequestReturnType<T, StatusCode extends number = 200> = T extends { [K in StatusCode]: infer R } ? R : never;

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
