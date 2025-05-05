import { inject } from '@vercel/analytics';
import { Analytics } from '@vercel/analytics/react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRevalidator } from 'react-router';

import './assets/css/index.css';
import type { Info, Route } from './+types/root';
import API from './api/api';
import { authClient } from './api/auth';
import { SHOW_NEW_STUDENT_INFO } from './constant';

const appleSizes = ['57x57', '72x72', '60x60', '76x76', '114x114', '120x120', '144x144', '152x152', '180x180'];

export const links: Route.LinksFunction = () => [
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
];

const metaData = {
  url: 'https://tihlde.org',
  title: 'TIHLDE',
  image: '/browser-icons/cover-image.jpg',
  description:
    'Linjeforeningen for Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Digital transformasjon og Informasjonsbehandling ved NTNU',
};

export const meta: Route.MetaFunction = () => [
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
];

export type RootLoaderData = Info['loaderData'];

export async function clientLoader() {
  try {
    const auth = await authClient();
    return {
      fetched: true,
      auth,
    };
  } catch {
    return {
      fetched: true,
      auth: undefined,
    };
  }
}

export default function App() {
  const loaderData = useLoaderData<RootLoaderData>();
  const revalidator = useRevalidator();
  // TODO: This is ugly fix this once react-router fixes their loaderData bug
  useEffect(() => {
    if (!loaderData?.fetched) {
      revalidator.revalidate();
    }
  }, [loaderData, revalidator]);

  return <Outlet />;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta content='width=device-width, initial-scale=1' name='viewport' />
        <meta content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no' name='viewport' />

        <meta content='#16356e' data-react-helmet='true' name='theme-color' />

        {/* TODO: Convert the meta tags to the links export */}
        <link href='/browser-icons/android-icon-192x192.png' rel='icon' sizes='192x192' type='image/png' />
        <link href='/browser-icons/favicon-32x32.png' rel='icon' sizes='32x32' type='image/png' />
        <link href='/browser-icons/favicon-96x96.png' rel='icon' sizes='96x96' type='image/png' />
        <link href='/browser-icons/favicon-16x16.png' rel='icon' sizes='16x16' type='image/png' />
        <link href='/manifest.json' rel='manifest' />
        <meta content='#ffffff' name='msapplication-TileColor' />
        <meta content='/browser-icons/ms-icon-144x144.png' name='msapplication-TileImage' />
        <Meta />
        <Links />
      </head>
      <body>
        <PostHogProvider
          apiKey={import.meta.env.VITE_POSTHOG_API_KEY}
          options={{
            api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
          }}>
          <Analytics />
          {children}
          <ScrollRestoration />
          <Scripts />
        </PostHogProvider>
      </body>
    </html>
  );
}

// TODO: Add skeleton rendering for hydration fallback
export function HydrateFallback() {
  return null;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

if (typeof window === 'object') {
  inject();

  // Initialize PostHog
  if (import.meta.env.VITE_POSTHOG_API_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          // Disable capturing in development
          posthog.opt_out_capturing();
        }
      },
    });
  }

  // eslint-disable-next-line no-console
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
  // eslint-disable-next-line no-console
  console.log(
    `%cSnoker du rundt? Det liker vi. Vi i Index ser alltid etter nye medlemmer. ${
      SHOW_NEW_STUDENT_INFO ? 'Søk om å bli med da vel! https://s.tihlde.org/bli-med-i-index' : ''
    }`,
    'font-weight: bold; font-size: 1rem;color: #ff9400;',
  );
  // eslint-disable-next-line no-console
  console.log(
    'Lyst på en ny badge? Skriv %cbadge();%c i konsollen da vel!',
    'background-color: #121212;font-family: "Monaco", monospace;padding: 2px; color: white;',
    '',
  );
  const rickroll = async () => {
    const RICKROLLED_BADGE_ID = '372e3278-3d8f-4c0e-a83a-f693804f8cbb';
    API.createUserBadge({ flag: RICKROLLED_BADGE_ID }).catch(() => null);
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).badge = rickroll;
}
