import { createRouter, RouterProvider } from '@tanstack/react-router';
import API from '~/api/api';
import { SHOW_NEW_STUDENT_INFO } from '~/constant';
import { getQueryClient, ReactQueryProvider } from '~/queryClient';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import ReactDOM from 'react-dom/client';

import { routeTree } from './routeTree.gen';

import './assets/css/index.css';

import { ThemeProvider } from './hooks/Theme';

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient: getQueryClient(),
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

(() => {
  if (typeof window !== 'object') {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).__INDEX_ASCII_ART__) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__INDEX_ASCII_ART__ = true;

  // Initialize PostHog

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

  if (import.meta.env.DEV) {
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).tihldeDev = {
        analyticsEvent: (await import('~/hooks/Utils')).analyticsEvent,
        getQueryClient,
        API: (await import('~/api/api')).default,
        URLS: (await import('~/URLS')).default,
        posthog,
      };
    })();
  }

  // eslint-disable-next-line no-console
  console.log(
    `%c
            ██╗███╗   ██╗██████╗ ███████╗██╗  ██╗
            ██║████╗  ██║██╔══██╗██╔════╝╚██╗██╔╝
  Laget av  ██║██╔██╗ ██║██║  ██║█████╗   ╚███╔╝
            ██║██║╚██╗██║██║  ██║██╔══╝   ██╔██╗
            ██║██║ ╚████║██████╔╝███████╗██╔╝ ██╗
            ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝`,
    'font-size: 1rem; color: #ff9400;',
  );
  // eslint-disable-next-line no-console
  console.log(
    `%cSnoker du rundt? Det liker vi. Vi i Index ser alltid etter nye medlemmer. ${
      SHOW_NEW_STUDENT_INFO ? 'Søk om å bli med da vel! https://s.tihlde.org/bli-med-i-index' : ''
    }`,
    'font-weight: bold; font-size: 1rem;color: #ff9400;',
  );
  // eslint-disable-next-line no-console
  console.log(
    'Lyst på en ny badge? Skriv %cbadge();%c i konsollen da vel!',
    'background-color: #121212;font-family: "Monaco", monospace;padding: 2px; color: white;',
    '',
  );
  const rickroll = async () => {
    const RICKROLLED_BADGE_ID = '372e3278-3d8f-4c0e-a83a-f693804f8cbb';
    API.createUserBadge({ flag: RICKROLLED_BADGE_ID }).catch(() => null);
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).badge = rickroll;
})();

const rootElement = document.getElementById('app')!;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <PostHogProvider client={posthog}>
      <ReactQueryProvider>
        <RouterProvider router={router} />
      </ReactQueryProvider>
    </PostHogProvider>
  </ThemeProvider>,
);
