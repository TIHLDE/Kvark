/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PHOTON_API_URL: string;
  readonly VITE_FEIDE_CLIENT_ID?: string;
  readonly VITE_FEIDE_REDIRECT_URI?: string;
  readonly VITE_FEIDE_AUTH_STATE?: string;
  readonly VITE_SLACK_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
