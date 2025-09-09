import { z } from 'zod';

const envSchema = z.object({
  API_URL: z.string().url().default('https://api.tihlde.org'),
  PHOTON_API_URL: z.string().url().default('https://photon.tihlde.org'),
});

export const env = envSchema.parse({
  API_URL: import.meta.env.VITE_API_URL,
  PHOTON_API_URL: import.meta.env.VITE_PHOTON_API_URL,
});
