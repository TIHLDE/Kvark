import { createFileRoute, Outlet } from '@tanstack/react-router';
import ShortCutMenu from '~/components/miscellaneous/shortCutMenu';
import Navigation from '~/components/navigation/Navigation';

export const Route = createFileRoute('/_MainLayout')({
  component: Layout,
  pendingComponent: Skeleton,
  errorComponent: ({ error }) => (
    <Navigation>
      <div className='my-16 container mx-auto p-4 pt-16'>
        <h1 className='text-2xl font-bold'>Something went wrong</h1>
        <p className='mt-2'>An unexpected error occurred. Please try again later.</p>
        {import.meta.env.DEV && error instanceof Error && (
          <pre className='mt-4 p-4 bg-muted rounded overflow-x-auto'>
            <code>{error.stack}</code>
          </pre>
        )}
      </div>
    </Navigation>
  ),
});

function Layout() {
  return (
    <Navigation>
      <ShortCutMenu />
      <Outlet />
    </Navigation>
  );
}

function Skeleton() {
  return (
    <Navigation>
      <ShortCutMenu />
    </Navigation>
  );
}
