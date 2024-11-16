import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import URLS from 'URLS';

import { useSetRedirectUrl } from 'hooks/Misc';
import { useCreateOAuthCode, useOAuthApp } from 'hooks/OAuth';
import { useUser } from 'hooks/User';

import LoadingSpinnner from 'components/miscellaneous/LoadingSpinner';
import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';

const OAuthPage = () => {
  // const { event } = useAnalytics();
  const setLogInRedirectURL = useSetRedirectUrl();
  const { data: user, isLoading } = useUser();

  const clientId = useMemo(() => {
    const url = new URL(window.location.href);
    return url.searchParams.get('client_id') ?? undefined;
  }, []);
  const redirectUri = useMemo(() => {
    const url = new URL(window.location.href);
    return url.searchParams.get('redirect_uri') ?? undefined;
  }, []);

  const { data: OAuthApp, isLoading: isOAuthAppLoading } = useOAuthApp(clientId);
  const { mutateAsync: apiCreateOAuthCode } = useCreateOAuthCode();

  if (!clientId || !redirectUri) {
    return <Navigate to={'/'} />;
  }

  if (user === undefined && !isLoading) {
    const redirect = new URL(window.location.href);
    setLogInRedirectURL(redirect.pathname + redirect.search);
    return <Navigate to={URLS.login} />;
  }

  async function generateOAuthCode() {
    const { redirect_url } = await apiCreateOAuthCode({
      clientId: clientId!,
      redirectUri: redirectUri!,
    });

    window.location.href = redirect_url;
  }
  async function cancelOAuth() {
    console.log('Canceling OAuth');
  }

  return (
    <div className='grid place-items-center h-[100vh]'>
      {(isLoading || isOAuthAppLoading) && <LoadingSpinnner />}
      {!isLoading && user && OAuthApp && (
        <Card className='max-w-xl w-full mx-auto text-center'>
          <CardHeader className='items-center'>
            {OAuthApp.app_image && <img alt='OAuth App Icon' className='aspect-square w-[25%] rounded-full mb-5' src={OAuthApp.app_image} />}
            <CardTitle>Autoriser {OAuthApp.app_name}</CardTitle>
            <CardDescription>Sørg for at du stoler på appen før du gir den tillgang til brukerinfomasjonen din!</CardDescription>
          </CardHeader>
          <CardContent className='flex gap-5 px-20'>
            <Button className='w-full' onClick={cancelOAuth} variant={'destructive'}>
              Avbryt
            </Button>
            <Button className='w-full' onClick={generateOAuthCode}>
              Godta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OAuthPage;
