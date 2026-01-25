import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
  loader() {
    return {
      breadcrumbs: 'Oversikt',
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='space-y-4'>
      Hello Admin overview!
      <div className='h-32 w-32 bg-red-500'></div>
    </div>
  );
}
