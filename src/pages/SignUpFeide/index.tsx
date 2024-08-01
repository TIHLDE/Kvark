import { FEIDE_AUTH_STATE } from 'constant';
import { ArrowRight, LoaderCircle, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import URLS from 'URLS';

import { User } from 'types';

import API from 'api/api';

import Page from 'components/navigation/Page';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';

const SignUpFeide = () => {
  const location = useLocation();
  const [queryError, setQueryError] = useState<string>();
  const [feideError, setFeideError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createdUser, setCreatedUser] = useState<User>();

  const createUser = async (code: string) => {
    setIsLoading(true);
    try {
      const user = await API.feideAuthenticate(code);
      setCreatedUser(user.detail as unknown as User);
    } catch (error) {
      setFeideError(error.detail || 'En feil oppstod under autentisering, vennligst prøv igjen.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    if (!code || !state || state !== FEIDE_AUTH_STATE) {
      setQueryError('Mangler påkrevde parametere, vennligst prøv igjen.');
      return;
    }

    createUser(code);
  }, [location]);

  return (
    <Page>
      <div className='max-w-xl w-full mx-auto'>
        {queryError && (
          <div className='space-y-8'>
            <h1 className='text-center'>{queryError}</h1>

            <div className='flex justify-center'>
              <Button asChild variant='ghost'>
                <Link to={URLS.signup}>
                  Opprett bruker
                  <ArrowRight className='ml-2 w-5 h-5 stroke-[1.5px]' />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className='space-y-8'>
            <LoaderCircle className='mx-auto animate-spin w-12 h-12' />
            <h1 className='text-center text-2xl font-bold'>Oppretter bruker...</h1>
          </div>
        )}

        {feideError && (
          <div className='space-y-8 '>
            <ShieldAlert className='mx-auto w-16 h-16 text-red-500' />
            <h1 className='text-center'>{feideError}</h1>

            <div className='flex justify-center'>
              <Button asChild variant='ghost'>
                <Link to={URLS.signup}>
                  Gå tilbake til registrering
                  <ArrowRight className='ml-2 w-5 h-5 stroke-[1.5px]' />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {createdUser && (
          <Card>
            <CardContent className='p-8 space-y-8'>
              <h1 className='text-center text-2xl font-bold'>Velkommen til TIHLDE!</h1>

              <p>
                Du har nå fått opprettet en bruker med brukernavn <span className='font-bold'>{createdUser.user_id}</span>. Din bruker er nå klar til bruk, og
                ditt autogenererte passord er sendt til din e-post <span className='font-bold'>{createdUser.email}</span>.
              </p>

              <Button asChild className='w-full'>
                <Link to={URLS.login}>Logg inn</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Page>
  );
};

export default SignUpFeide;
