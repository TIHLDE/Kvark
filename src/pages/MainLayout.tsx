import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Outlet } from 'react-router';
import ShortCutMenu from '~/components/miscellaneous/shortCutMenu';
import Navigation from '~/components/navigation/Navigation';
import { Toaster } from '~/components/ui/sonner';
import { ThemeProvider } from '~/hooks/Theme';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Don't refetch data before 5 min has passed
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <NuqsAdapter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
};

export default function Layout() {
  return (
    <Providers>
      {/* Why scroll to top */}
      {/* <ScrollToTop /> */}
      <Navigation>
        <ShortCutMenu />
        <Outlet />
        <Toaster />
      </Navigation>
    </Providers>
  );
}
