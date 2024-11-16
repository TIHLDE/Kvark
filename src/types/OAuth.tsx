export type OAuthAppInfo = {
  client_id: string;
  app_name: string;
  app_image: string | undefined;
};

export type OAuthCodeResponse = {
  redirect_url: string;
  code: string;
};
