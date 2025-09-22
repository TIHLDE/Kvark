import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';

export default {
  appDirectory: 'src',
  // Convert from SPA to Server Side Rendering by setting ssr to true
  ssr: false,
  presets: [vercelPreset()],
} satisfies Config;
