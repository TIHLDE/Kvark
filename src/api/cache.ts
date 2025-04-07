import { type CacheEntry, cachified, verboseReporter } from '@epic-web/cachified';

class CustomCache {
  /**
   * Internal Map to store cache entries
   */
  private data: Map<string, { created: number; value: CacheEntry }>;
  /**
   * Default TTL (Time To Live) for cache entries in milliseconds
   */
  private defaultTTL: number;
  /**
   * Creates a simple ttl cache
   * @param defaultTTL the default TTL (Time To Live) for cache entries in milliseconds
   */
  constructor(defaultTTL: number) {
    this.defaultTTL = defaultTTL;
    this.data = new Map();
  }

  set DefaultTTL(ttl: number) {
    this.defaultTTL = ttl;
  }

  get DefaultTTL() {
    return this.defaultTTL;
  }

  set(key: string, value: CacheEntry) {
    this.data.set(key, { created: Date.now(), value });
  }

  get(key: string) {
    const entry = this.data.get(key);
    if (entry && entry.created + (entry.value.metadata.ttl ?? 0) > Date.now()) {
      return entry.value;
    }
    return undefined;
  }

  delete(key: string) {
    this.data.delete(key);
  }
  clear() {
    this.data.clear();
  }
}

// Default TTL is 2 minutes
const cache = new CustomCache(2 * 60 * 1000);

type CachifiedOptions<Value> = Omit<Parameters<typeof cachified<Value>>[0], 'cache'>;
function cachifiedWrapper<Value>(options: CachifiedOptions<Value>) {
  return cachified<Value>(
    {
      cache,
      ...options,
    },
    verboseReporter(),
  );
}

export { cache, cachifiedWrapper as cachified };
