import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import API from '~/api/api';
import { SHOW_NEW_STUDENT_INFO } from '~/constant';
import { ThemeProvider } from '~/hooks/Theme';
import { PostHogProvider } from '~/integrations/posthog';
import * as TanstackQuery from '~/integrations/tanstack-query';

import { routeTree } from './routeTree.gen';

import './assets/css/index.css';

export function getRouter() {
  const queryContext = TanstackQuery.getContext();

  // Set up a Router instance
  const router = createRouter({
    routeTree,
    context: { ...queryContext },
    defaultPreload: 'intent',
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <ThemeProvider>
          <PostHogProvider>
            <TanstackQuery.Provider {...queryContext}>{props.children}</TanstackQuery.Provider>
          </PostHogProvider>
        </ThemeProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: queryContext.queryClient,
  });

  return router;
}

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
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

  if (import.meta.env.DEV) {
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).tihldeDev = {
        analyticsEvent: (await import('~/hooks/Utils')).analyticsEvent,
        getQueryClient: TanstackQuery.getQueryClient,
        API: (await import('~/api/api')).default,
        URLS: (await import('~/URLS')).default,
        posthog: (await import('posthog-js')).default,
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
