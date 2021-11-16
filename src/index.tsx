/* eslint-disable no-console */
import { ReactNode } from 'react';
import { render } from 'react-dom';
import 'assets/css/index.css';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { CssBaseline } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { broadcastQueryClient } from 'react-query/broadcastQueryClient-experimental';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'delayed-scroll-restoration-polyfill';
import { SHOW_NEW_STUDENT_INFO } from 'constant';
import API from 'api/api';

// Services
import { ThemeProvider } from 'hooks/Theme';
import { MiscProvider } from 'hooks/Misc';
import { SnackbarProvider } from 'hooks/Snackbar';

// Project components
import MessageGDPR from 'components/miscellaneous/MessageGDPR';
import Navigation from 'components/navigation/Navigation';
import AppRoutes from 'AppRoutes';

export const muiCache = createCache({
  key: 'mui',
  prepend: true,
});

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Don't refetch data before 5 min has passed
        refetchOnWindowFocus: false,
        cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  });

  /**
   * Experimental React Query plugin, can break when updating React Query
   * Broadcasts changes to the state between tabs in the browser to ensure that the data is equal
   * https://react-query.tanstack.com/plugins/broadcastQueryClient
   */
  broadcastQueryClient({ queryClient, broadcastChannel: 'TIHLDE' });

  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline enableColorScheme />
          <QueryClientProvider client={queryClient}>
            <MiscProvider>
              <SnackbarProvider>{children}</SnackbarProvider>
            </MiscProvider>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export const Application = () => {
  return (
    <Providers>
      <BrowserRouter>
        <Navigation>
          <AppRoutes />
          <MessageGDPR />
        </Navigation>
      </BrowserRouter>
    </Providers>
  );
};

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
console.log(
  `%cSnoker du rundt? Det liker vi. Vi i Index ser alltid etter nye medlemmer. ${
    SHOW_NEW_STUDENT_INFO ? 'Søk om å bli med da vel! https://s.tihlde.org/bli-med-i-index' : ''
  }`,
  'font-weight: bold; font-size: 1rem;color: #ff9400;',
);
console.log(
  'Lyst på en ny badge? Skriv %cbadge();%c i konsollen da vel!',
  'background-color: #121212;font-family: "Monaco", monospace;padding: 2px; color: white;',
  '',
);
const rickroll = () => {
  const RICKROLLED_BADGE_ID = '8e4eb14a-77f5-4a10-b3ae-548d0f607528';
  API.createUserBadge({ badge_id: RICKROLLED_BADGE_ID }).catch(() => null);
  window.gtag('event', 'rickrolled', {
    event_category: 'easter-egg',
    event_label: 'Rickrolled in the console',
  });
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).badge = rickroll;

render(<Application />, document.getElementById('root'));
