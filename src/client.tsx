import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start/client';
import { worker } from '~/mocks/browser';

async function start() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCKS !== 'false') {
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    );
  });
}

start();
