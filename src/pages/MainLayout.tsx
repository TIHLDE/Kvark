import ShortCutMenu from '~/components/miscellaneous/shortCutMenu';
import Navigation from '~/components/navigation/Navigation';
import { Toaster } from '~/components/ui/sonner';
import { ThemeProvider } from '~/hooks/Theme';
import { ReactQueryProvider } from '~/queryClient';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { Outlet } from 'react-router';

const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <NuqsAdapter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <ReactQueryProvider>{children}</ReactQueryProvider>
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
