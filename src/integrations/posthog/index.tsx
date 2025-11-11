import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, useState } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    posthog.init(import.meta.env.VITE_POSTHOG_API_KEY ?? 'fake token', {
      defaults: '2025-05-24',
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          // Disable capturing in development
          posthog.opt_out_capturing();
        }
      },
      debug: import.meta.env.DEV,
    });

    setHydrated(true);
  }, []);

  if (!hydrated) return <>{children}</>;
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
