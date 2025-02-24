import API from './api';
import { cachified } from './cache';

export async function getGroup(slug: string) {
  return await cachified({
    key: `group:${slug}`,
    ttl: 60 * 1000, // 1 minute
    getFreshValue: async () => {
      return API.getGroup(slug);
    },
  });
}
