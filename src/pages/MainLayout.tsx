import { createFileRoute, Outlet } from '@tanstack/react-router';
import ShortCutMenu from '~/components/miscellaneous/shortCutMenu';
import Navigation from '~/components/navigation/Navigation';

export const Route = createFileRoute('/_MainLayout')({
  component: Layout,
  pendingComponent: Skeleton,
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
  <Navigation>
    <ShortCutMenu />
  </Navigation>;
}
