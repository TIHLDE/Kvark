import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_MainLayout/arrangementer/$id/{-$urlTitle}')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_MainLayout/arrangementer/$id/-$urlTitle"!</div>;
}
