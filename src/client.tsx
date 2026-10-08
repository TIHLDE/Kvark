import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start/client';
import { MOCKS_ENABLED } from '~/constant';
import { worker } from '~/mocks/browser';

async function start() {
  if (MOCKS_ENABLED) {
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
