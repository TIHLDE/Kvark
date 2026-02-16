import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_MainLayout/arrangementer/registrering/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_MainLayout/arrangementer/registrering/$id"!</div>;
}
