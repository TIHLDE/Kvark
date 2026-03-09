import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_MainLayout/DNV')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello &quot;/_MainLayout/DNV&quot;!</div>;
}
