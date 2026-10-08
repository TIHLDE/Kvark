import { createStart } from '@tanstack/react-start';
import { MOCKS_ENABLED } from '~/constant';

export const startInstance = createStart(() => ({
  // The MSW worker only intercepts requests in the browser, so loaders must not run on the server in mock mode
  defaultSsr: !MOCKS_ENABLED,
}));
