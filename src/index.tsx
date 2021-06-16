/* eslint-disable no-console */
import { ReactNode, Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/index.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StyledEngineProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import 'delayed-scroll-restoration-polyfill';

// Services
import { ThemeProvider } from 'context/ThemeContext';
import { MiscProvider } from 'api/hooks/Misc';
import { SnackbarProvider } from 'api/hooks/Snackbar';

// Project components
import MessageGDPR from 'components/miscellaneous/MessageGDPR';
import Page from 'components/navigation/Page';
import Navigation from 'components/navigation/Navigation';
import AppRoutes from 'AppRoutes';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2, // Don't refetch data before 2 min has passed
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <MiscProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </MiscProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export const Application = () => {
  return (
    <Providers>
      <BrowserRouter>
        <Navigation>
          <Suspense fallback={<Page options={{ filledTopbar: true, title: 'Laster...' }} />}>
            <AppRoutes />
          </Suspense>
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
console.log('%cSnoker du rundt? Det liker vi. Vi i Index ser alltid etter nye medlemmer.', 'font-weight: bold; font-size: 1rem;color: #ff9400;');
console.log(
  'Lyst på en ny badge? Skriv %cbadge();%c i konsollen da vel!',
  'background-color: #121212;font-family: "Monaco", monospace;padding: 2px; color: white;',
  '',
);
const rickroll = () => (window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).badge = rickroll;

ReactDOM.render(<Application />, document.getElementById('root'));
