import { FEIDE_AUTH_STATE, FEIDE_AUTH_URL, FEIDE_CLIENT_ID, FEIDE_REDIRECT_URI } from 'constant';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import Page from 'components/navigation/Page';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';

import FEIDE_ICON from 'assets/icons/feide.svg';

const SignUpOptions = () => {
  const createFeideSession = () => {
    const url = `${FEIDE_AUTH_URL}?client_id=${FEIDE_CLIENT_ID}&response_type=code&redirect_uri=${FEIDE_REDIRECT_URI}&scope=openid&state=${FEIDE_AUTH_STATE}`;

    window.location.replace(url);
  };

  return (
    <Page>
      <Card className='max-w-2xl w-full mx-auto'>
        <CardContent className='space-y-12 p-8'>
          <div className='space-y-4'>
            <h1 className='text-2xl font-bold'>Opprett bruker hos TIHLDE</h1>
            <p className='text-sm text-muted-foreground'>
              Vi anbefaler å registrere bruker automatisk ved hjelp av Feide. På denne måten vil du få tilgang til TIHLDE sine plattformer umiddelbart. Hvis du
              ikke har Feide bruker enda, eller om det skulle oppstå et problem kan du registrere deg manuelt. Da trenger vi bevis på at du studerer ved ett av
              TIHLDE sine studieretninger for å registrere brukeren din.
            </p>
          </div>
          <div className='w-full space-y-2 md:space-y-0 md:flex md:items-center md:space-x-4'>
            <Button className='w-full' onClick={createFeideSession} size='lg'>
              <img alt='Feide ikon' className='mr-2 w-5 h-5' src={FEIDE_ICON} />
              Feide
            </Button>
            <Button asChild className='w-full' size='lg' variant='outline'>
              <Link to={URLS.signupForm}>
                <TihldeLogo className='m-0 w-6 h-6 mr-2' size='small' />
                Manuelt
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default SignUpOptions;
