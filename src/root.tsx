import { inject } from '@vercel/analytics';
import { Analytics } from '@vercel/analytics/react';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import './assets/css/index.css';
import type { Route } from './+types/root';
import API from './api/api';
import { SHOW_NEW_STUDENT_INFO } from './constant';

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
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta content='width=device-width, initial-scale=1' name='viewport' />
        <meta content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no' name='viewport' />

        {/* TODO: Convert the meta tags to the links export */}
        <meta content='#16356e' data-react-helmet='true' name='theme-color' />
        <title>TIHLDE</title>
        <meta
          content='Linjeforeningen for Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Digital transformasjon og Informasjonsbehandling ved NTNU'
          name='description'
        />

        <meta content='https://tihlde.org' property='og:url' />
        <meta content='website' property='og:type' />
        <meta content='TIHLDE' property='og:title' />
        <meta
          content='Linjeforeningen for Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Digital transformasjon og Informasjonsbehandling ved NTNU'
          property='og:description'
        />
        <meta content='https://tihlde.org/browser-icons/cover-image.jpg' property='og:image' />

        <meta content='https://tihlde.org' property='twitter:url' />
        <meta content='summary_large_image' name='twitter:card' />
        <meta content='TIHLDE' name='twitter:title' />
        <meta
          content='Linjeforeningen for Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Digital transformasjon og Informasjonsbehandling ved NTNU'
          name='twitter:description'
        />
        <meta content='https://tihlde.org/browser-icons/cover-image.jpg' name='twitter:image' />

        <link href='/browser-icons/apple-icon-57x57.png' rel='apple-touch-icon' sizes='57x57' />
        <link href='/browser-icons/apple-icon-72x72.png' rel='apple-touch-icon' sizes='72x72' />
        <link href='/browser-icons/apple-icon-60x60.png' rel='apple-touch-icon' sizes='60x60' />
        <link href='/browser-icons/apple-icon-76x76.png' rel='apple-touch-icon' sizes='76x76' />
        <link href='/browser-icons/apple-icon-114x114.png' rel='apple-touch-icon' sizes='114x114' />
        <link href='/browser-icons/apple-icon-120x120.png' rel='apple-touch-icon' sizes='120x120' />
        <link href='/browser-icons/apple-icon-144x144.png' rel='apple-touch-icon' sizes='144x144' />
        <link href='/browser-icons/apple-icon-152x152.png' rel='apple-touch-icon' sizes='152x152' />
        <link href='/browser-icons/apple-icon-180x180.png' rel='apple-touch-icon' sizes='180x180' />
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
        <Analytics />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
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
  console.log(
    `%cSnoker du rundt? Det liker vi. Vi i Index ser alltid etter nye medlemmer. ${
      SHOW_NEW_STUDENT_INFO ? 'Søk om å bli med da vel! https://s.tihlde.org/bli-med-i-index' : ''
    }`,
    'font-weight: bold; font-size: 1rem;color: #ff9400;',
  );
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
