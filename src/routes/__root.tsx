import '~/assets/css/index.css';

import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { authClient } from '~/api/auth';
import Http404 from '~/components/shells/Http404';
import { Toaster } from '~/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router';

const appleSizes = ['57x57', '72x72', '60x60', '76x76', '114x114', '120x120', '144x144', '152x152', '180x180'];

const metaData = {
  url: 'https://tihlde.org',
  title: 'TIHLDE',
  image: '/browser-icons/cover-image.jpg',
  description:
    'Linjeforeningen for Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Digital transformasjon og Informasjonsbehandling ved NTNU',
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: clientLoader,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
      },
      ...appleSizes.map((size) => ({
        rel: 'apple-touch-icon',
        sizes: size,
        href: `/browser-icons/apple-icon-${size}.png`,
      })),
    ],
    meta: [
      { title: 'TIHLDE' },
      { name: 'description', content: metaData.description },
      { property: 'og:url', content: metaData.url },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', conent: metaData.title },
      { property: 'og:description', content: metaData.description },
      { property: 'og:image', content: metaData.image },

      { property: 'twitter:url', content: metaData.url },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: metaData.title },
      { property: 'twitter:description', content: metaData.description },
      { property: 'twitter:image', content: metaData.image },
    ],
  }),
  component: App,
  notFoundComponent: () => <Http404 />,
});

async function clientLoader() {
  await authClient();
}

export default function App() {
  return (
    <NuqsAdapter>
      <HeadContent />
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools initialIsOpen={false} position='bottom-left' />
      <ReactQueryDevtools initialIsOpen={false} position='bottom' />
    </NuqsAdapter>
  );
}

// export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
//   let message = 'Oops!';
//   let details = 'An unexpected error occurred.';
//   let stack: string | undefined;

//   if (isRouteErrorResponse(error)) {
//     message = error.status === 404 ? '404' : 'Error';
//     details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
//   } else if (import.meta.env.DEV && error && error instanceof Error) {
//     details = error.message;
//     stack = error.stack;
//   }

//   return (
//     <main className='pt-16 p-4 container mx-auto'>
//       <h1>{message}</h1>
//       <p>{details}</p>
//       {stack && (
//         <pre className='w-full p-4 overflow-x-auto'>
//           <code>{stack}</code>
//         </pre>
//       )}
//     </main>
//   );
// }
